module.exports = function(io) {
  var mongo = require('mongodb');
  var monk = require('monk');
  var db = monk('localhost:27017/connect4');
  var board = db.get('gameboard');
  var lastPlay = db.get('lastplay');
  var winchecker = require('./winchecker.js');
  var uaParser = require('ua-parser');
  io.sockets.on('connection', function (socket)
  {
    var UserAgent = uaParser.parse(socket.request.headers['user-agent']);
    socket.on('getBoard', function (data) {
      console.log('A user requested the board.')
      db.get('gameboard').find({}, {},
        function(e, docs)
        {
          socket.emit("receiveBoard", docs);
        });
    });

    socket.on('play', function (data) {
      var canDrop = true;
      console.log('Column: ' + data.column + ', Agent: ' + UserAgent.ua.family);
      // figure out which row this column gets.
      if (data.column == undefined
        || data.column < 0
        || data.column > 6) { // Out of range or undefined.
        console.log('unable to drop.');
        canDrop = false;
      }
      lastPlay.find({}, {}, function (e, docs) {
        if (docs.length === 0) { // if last play is somehow empty.
          io.emit('disableDrop')
          lastPlay.insert({ agent: UserAgent.ua, time: new Date()},
          function (err, doc) {
            if (err) {
              console.log(err);
            }
          });
        }
        else { //deny same agent two plays in a row.
          if (docs[0].agent.family === UserAgent.ua.family) {
            console.log(UserAgent.ua.family
              + " played last. Let someone else have a go.");
            canDrop = false;
            io.emit('disableDrop');
          }
          else { // clear last player and insert current.
            lastPlay.remove({}, function (err) {
              console.log(err);
            });
            lastPlay.insert({ agent: UserAgent.ua, time: new Date()},
            function (err, doc) {
              if (err) {
                console.log(err);
              }
            });
          }
        }
      });
      if (canDrop) {
        // equivalent to sql's select top order by.
        //Get the highest row value. for the column.
        board.find(
          { 'column': data.column },
          {'sort': {'row': -1}, limit: 1},
          function (e, docs)
          {
            console.log(docs.length);
            var insertRow = 0;
            if (docs[0] != undefined)
            {
              insertRow = docs[0].row + 1
            }
            if (insertRow > 5) { //The row is full! This is not allowed!
              return false;
            }
            console.log("Inserting at row " + insertRow
            + ", column " + data.column);
            var SuccessfulPlay = {
              'row': insertRow,
              'column': data.column,
              'agent': UserAgent.ua.family
            };

            board.insert(SuccessfulPlay, function (err, doc) {
              if (err) {
                debugger;
                console.log(err);
              }
              else {
                console.log("Successfully inserted.")
                board.find({},{}, function (e, docs) {

                  var winResult = winchecker.check(docs, SuccessfulPlay);
                  if (winResult.win) {
                    board.remove({}, function (err) { //clear the board.
                      console.log(err);
                    });
                    lastPlay.remove({}, function (err) { // clear who played last.
                      console.log(err);
                      io.emit('enableDrop');
                    });
                    io.emit('receiveWin', winResult);
                  }
                  console.log({"Title": "Win Result", "Value": winResult})
                });
              };
            });
            io.emit('receivePlay', SuccessfulPlay);
        });
      }
    });
    // End of socket.on('play')
  });
};

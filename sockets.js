module.exports = function(io) {
  var mongo = require('mongodb');
  var monk = require('monk');
  var db = monk('localhost:27017/connect4');
  var board = db.get('gameboard');
  var winchecker = require('./winchecker.js');
  var uaParser = require('ua-parser');
  io.sockets.on('connection', function (socket)
  {
    var UserAgent = uaParser.parse(socket.request.headers['user-agent']);
    socket.on('play', function (data) {
      console.log('play: ' + data.column);
      // figure out which row this column gets.
      if (data.column == undefined || data.column < 0 || data.column > 6) {
        console.log('unable to drop.');
        return false;
      }
      // equivalent to sql's select top order by. Get the highest column value.
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
          if (insertRow > 5)
          {
            return false;
          }
          console.log("Inserting at row " + insertRow, ", column " + data.column);
          var SuccessfulPlay = {
            'row': insertRow,
            'column': data.column,
            'agent': UserAgent.ua.family
          };
          board.insert(SuccessfulPlay, function (err, doc) {
            if (err) {
              console.log("there was a problem adding this crap.");
            }
            else {
              console.log("Successfully inserted.")
              board.find({},{}, function (e, docs) {

                var winResult = winchecker.check(docs, SuccessfulPlay);
                if (winResult.win) {
                  //wait 5 seconds and clear the board.
                  board.remove({}, function (err) {
                    console.log(err);
                  });
                  io.emit('receiveWin', winResult);
                }
                console.log({"Title": "Win Result", "Value": winResult})
              });
            };
          });
          io.emit('receivePlay', SuccessfulPlay);
      });
    });

    socket.on('getBoard', function (data) {
      console.log('A user requested the board.')
      db.get('gameboard').find({}, {},
        function(e, docs)
        {
          socket.emit("receiveBoard", docs);
        });
    });
  });
};

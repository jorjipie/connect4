var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',
  function(req, res, next)
  {
  var browserimagepath = '';
  var gamedata = [];
  var rowcount = 6;
  var colcount = 7;

  //Build array in rowcount x colcount dimensions.
  for (i = 0; i < rowcount; i++) {
    var row = [];
    for (j = 0; j < colcount; j++) {
      row.push({imgurl: ''});
    }
    gamedata.push(row);
  }
  var agent = require('ua-parser').parse(req.headers['user-agent']);
  if (agent.ua.family == 'Chrome')
    { browserimagepath = '/images/icons/chrome.png'; }
  else if (agent.ua.family == 'IE')
    { browserimagepath = 'images/icons/ie.png'; }
  else if (agent.ua.family == 'Opera')
    { browserimagepath = 'images/icons/opera.png'; }
  else if (agent.ua.family == 'Firefox')
    { browserimagepath = 'images/icons/firefox.png'; }

  req.db.get('gameboard').find({}, {},
    function(e, docs)
    {
      for (var piece = 0; piece < docs.length; piece++)
      {
        if (docs[piece].agent == 'Chrome')
        {
          var row = 5-(docs[piece].row);
          var column = docs[piece].column;
          if (column != undefined && row != undefined) {
            gamedata[row][column].imgurl = '/images/icons/chrome.png';
          }
        }
      } // for loop
        res.render('index',
          {
            title: 'Express',
            useragent: agent,
            browserimagepath: browserimagepath,
            'gamedata': gamedata
          }
        ); //render
      }
    ); // find
  }
); //router.get

router.get('/userlist', function(req,res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(e,docs) {
    res.render('userlist', {
      "userlist": docs
    });
  });
});
router.get("/newuser", function(req,res) {
  res.render('newuser', { title: 'Add New User' });
});
router.post('/play', function(req,res) {
  var db = req.db;
  if (req.body.column === undefined) {
    res.send('column has not been defined.')
  }
  var column = req.body.column;

  if (column > 6)
  {
    res.send("Column is out of range.");
    return;
  }
  var browser = 'Chrome';
  var collection = db.get('gameboard');
  var winchecker = require('../winchecker.js');
  collection.find(
    { 'column': column},
    { 'sort': {'row': -1}, limit: 1 },
    function(e, docs) {
      var rowInsert = 0;
      if (docs[0] != undefined)
      {
        rowInsert = docs[0].row + 1;
      }
      if (rowInsert > 5) {
        res.send("Row is out of range.");
        return;
      }
      console.log('inserting at ' + rowInsert)
      collection.insert(
        {'column': column, 'row': rowInsert, 'agent': browser},
        function (err, doc)
        {
          if(err)
          {
            res.send("There was a problem adding this crap.")
          }
          else
          {
            collection.find({}, {}, function (e, result) {
              win = winchecker.check(result);
            });
            res.json(doc);
          }
        }
      );
    }
  );
});
router.post('/ClearTheBoard', function (req, res) {
  var board = req.db.get('gameboard');
  board.remove({}, function (err) {
    console.log(err);
    res.send("done.");
  });

});
router.post('/adduser', function (req,res) {
  var db = req.db;
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var collection = db.get('usercollection');

  collection.insert({
    "username": userName,
    "email": userEmail,
  }, function (err, doc) {
    if (err) {
      res.send("there was a problem adding the information to the database.");
    }
    else {
      res.redirect("userlist");
    }
  });
});

module.exports = router;

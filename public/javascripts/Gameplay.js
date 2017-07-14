var socket = io.connect('http://localhost:3000');
socket.emit('getBoard');
socket.on('receiveBoard', function (board) {
  console.log(board);
});
socket.on('news', function (data) {
  console.log(data);
});
var amLast = false;
socket.on('receivePlay', function (play) {
  if (!amLast) {
    $('.gameboard thead tr').show();
  }
  else {
    amLast = false;
  }
  var selector = ".gameboard tbody tr:nth-child(" + (6 - play.row) + ") td:nth-child(" + (play.column + 1) + ") img"
  var piece = $(selector);

  piece.attr('src', '/images/icons/' + play.agent + '.png');

  piece.addClass('bounceInDown');
  piece.addClass('animated');

  setTimeout(function () {
    piece.removeClass('bounceInDown');
    piece.removeClass('animated');
  }, 1000);

});
socket.on('receiveWin', function (win) {
  alert(win.agent + " wins!");
  location.reload();
});

socket.on('enableDrop', function () {
  $('.gameboard thead tr').show();
});
socket.on('disableDrop', function () {
  $('.gameboard thead tr').hide();
});

function drop(col) {
  socket.emit('play', {'column': col});
  $('.gameboard thead tr').hide();
  amLast = true;
}

function clearBoard() {
  $.post('/ClearTheBoard', function(response) {
    console.log(response);
  });
  location.reload();
}

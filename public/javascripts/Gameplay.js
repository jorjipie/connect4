var socket = io.connect('http://localhost:3000');
socket.emit('getBoard');
socket.on('receiveBoard', function (board) {
  console.log(board);
});
socket.on('news', function (data) {
  console.log(data);
});
socket.on('receivePlay', function (play) {
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

function drop(col) {
  socket.emit('play', {'column': col});
}

function clearBoard() {
  $.post('/ClearTheBoard', function(response) {
    console.log(response);
  });
  location.reload();
}

exports.check = function (docs, newPiece) {
  var result = { win: false, agent: "", places: []};
  var checkIndex = 0;
  var searchIndex = 0;

  if (docs.length < 4) {
    console.log("Not possible to have a win with " + docs.length + " pieces.");
    return result;
  }
  //dealing with a 2D array is easier than 1D for things that are 2D.
  //Obvious code is obvious.
  var buildTo2D = function(jsonArray, width, height) {
    //[row][column];
    var Array = function(length) {
      var output = [];
      for (var i = 0; i < length; i++)
      {
        output.push('');
      }
      return output;
    };
    var result = Array(width);
    for (var i = 0; i < width; i++) {
      result[i] = Array(height);
    }
    for (i = 0; i < jsonArray.length; i++) {
      if (jsonArray[i].row != undefined
        && jsonArray[i].column != undefined
        && jsonArray[i].agent != undefined)
      {
        result[jsonArray[i].row][jsonArray[i].column] = jsonArray[i].agent
      }
    }
    return result;
  }
  var board = buildTo2D(docs, 7, 6);
  //check left
  var success = true;
  var lastPiece = newPiece;
  var winningPieces = [lastPiece];
  while (success === true && lastPiece.column > 0 && winningPieces.length < 5) {
    console.log("checking left")
    if (board[newPiece.row][lastPiece.column-1] === newPiece.agent)
    {
      lastPiece.column--;
      winningPieces.push(lastPiece);
      console.log(winningPieces.length);
    }
    else { success = false; }
  }
  if (winningPieces.length >= 4) {
    console.log("WINNNER!!!");
    result.win = true;
    result.agent = newPiece.agent;
    result.places = winningPieces;
    return result;
  }
  //check right
  success = true;
  lastPiece = newPiece;
  while (success === true && lastPiece.column < 6 && winningPieces.length < 5) {
    if (newPiece.agent === board[newPiece.row][lastPiece.column+1])
    {
      lastPiece.column++;
      winningPieces.push(lastPiece);
    }
    else { success = false;}
  }
  //return if there's a win.
  if (winningPieces.length >= 4) {
    console.log("WINNNER!!!");
    result.win = true;
    result.agent = newPiece.agent;
    result.places = winningPieces;
    return result;
  }

  //check down.
  if (newPiece.row > 2)
  {
    success = true;
    lastPiece = newPiece;
    winningPieces = [lastPiece];
    console.log("checking down");
    while (success === true && winningPieces.length < 5 && lastPiece.row > 0)
    {
      if (newPiece.agent === board[lastPiece.row-1][newPiece.column])
      {
        lastPiece.row--;
        winningPieces.push(lastPiece);
      }
      else { success == false; }
    }
    if (winningPieces.length >= 4)
    {
      console.log("WINNNER!!!");
      result.win = true;
      result.agent = newPiece.agent;
      result.places = winningPieces;
      return result;
    }
  }

  return result;
};

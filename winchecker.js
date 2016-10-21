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
  var lastPiece = {
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent};

  var winningPieces = [{
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent}];
  console.log("winning pieces instantiate:");
  console.log(winningPieces);

  // check left;
  while (success === true && lastPiece.column > 0 && winningPieces.length < 5) {
    var newCol = lastPiece.column - 1;
    if (board[newPiece.row][newCol] === newPiece.agent)
    {
      winningPieces.push({
        row: newPiece.row,
        column: newCol,
        agent: newPiece.agent});

      lastPiece.column = newCol;
      console.log("winning pieces added left:");
      console.log(winningPieces);
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
  lastPiece = {
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent};

  while (success === true && lastPiece.column < 6 && winningPieces.length < 5) {
    var newCol = lastPiece.column + 1;
    if (newPiece.agent === board[newPiece.row][newCol])
    {
      winningPieces.push({
        row: newPiece.row,
        column: newCol,
        agent: newPiece.agent});

      console.log("winning pieces added right:");
      console.log(winningPieces);

      lastPiece.column = newCol;
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
    if (winningPieces.length > 3)
    {
      console.log("WINNNER!!!");
      result.win = true;
      result.agent = newPiece.agent;
      result.places = winningPieces;
      return result;
    }
  }
  //check diagonal. Top-Left to Bottom-right first.
  success = true;
  winningPieces = [{
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent}];

  lastPiece = {
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent};

  //top left.
  while (success === true
    && winningPieces.length < 4
    && lastPiece.row < 5
    && lastPiece.column > 0)
  {
    if (newPiece.agent === board[lastPiece.row+1][lastPiece.column-1]) {
      lastPiece.row++;
      lastPiece.column++;
      winningPieces.push({row: lastPiece.row, column: lastPiece.row, agent: lastPiece.agent});
    }
    else { success = false; }
  }

  success = true;
  lastPiece = {
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent};
  while (success === true
    && winningPieces.length < 4
    && lastPiece.row > 0
    && lastPiece.column < 6)
  {
    if (lastPiece.agent === board[lastPiece.row-1][lastPiece.column+1])
    {
      lastPiece.row--;
      lastPiece.column++;
      winningPieces.push({
        row: lastPiece.row,
        column: lastPiece.column,
        agent: newPiece.agent});
    }
    else { success = false; }
  }
  if (winningPieces.length > 3)
  {
    console.log("WINNNER!!!");
    result.win = true;
    result.agent = newPiece.agent;
    result.places = winningPieces;
    return result;
  }

  //Check Diagonal. Top-right to Bottom-Left.
  success = true;
  winningPieces = [{
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent}];
  lastPiece = {
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent};

  while (success === true
    && winningPieces.length < 4
    && lastPiece.row < 5
    && lastPiece.column < 6)
  {
    if (lastPiece.agent === board[lastPiece.row+1][lastPiece.column+1])
    {
      lastPiece.row++;
      lastPiece.column++;
      winningPieces.push({
        row: lastPiece.row,
        column: lastPiece.column,
        agent: newPiece.agent});
    }
    else { success = false; }
  }

  success = true;
  lastPiece = {
    row: newPiece.row,
    column: newPiece.column,
    agent: newPiece.agent};

  while (success === true
    && winningPieces.length < 4
    && lastPiece.row > 0
    && lastPiece.column > 0)
  {
    if (lastPiece.agent === board[lastPiece.row-1][lastPiece.column-1])
    {
      lastPiece.row--;
      lastPiece.column--;
      winningPieces.push({
        row: lastPiece.row,
        column: lastPiece.column,
        agent: newPiece.agent});
    }
    else { success = false; }
  }
  if (winningPieces.length > 3)
  {
    console.log("WINNNER!!!");
    result.win = true;
    result.agent = newPiece.agent;
    result.places = winningPieces;
    return result;
  }
  return result;
};

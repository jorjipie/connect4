exports.check = function (docs) {
  var Horizontals = [];
  var Verticals = [];
  var Diagonals = [];

  var result = { win: false, browser: "", places = []};
  //Check for things with the same thing next to them.
  for (int i = 0; i < docs.length; i++) {

    //Check to see if there's one to the right or left, and not already in the array.
      //If so, add to the horizontal array.
    var checkResult = CheckHorizontal(docs, i, "left")
    if (checkResult.Match === true)
    {
      Horizontals.push([
        { row: docs[i].row, column: docs[i].column },
        { row: checkResult.Result.row, column: checkResult.Result.column }
      ]);
    }
    checkresult = CheckHorizontal(docs, i, "right");
    if (checkResult.Match === true)
    {
      Horizontals.push([
        { row: docs[i].row, column: docs[i].column },
        { row: checkResult.Result.row, column: checkResult.Result.column }
      ]);
    }

  }
  //Check to see if there's one up or down. If so, add to the verticals array.

  //Check to see if there are any diagonals. If so, add to the Diagonals array.

  //Check for matches of 3 in a row horizontal.

  //Check for matches of 3 in a row vertical.

  //Check for matches of 3 in a row diagonal.

  //Check for matches of 3 in a row horizontal.

  //Check for matches of 3 in a row diagonal.

  //Check for matches of 3 in a row vertical.


  return result;
};
function CheckHorizontal (docs, index, direction) {
  if (direction === "left")
  {
    if (docs[index].column === 0)
    {
      return false;
    }
  }
}

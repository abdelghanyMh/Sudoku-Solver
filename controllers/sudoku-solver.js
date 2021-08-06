class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.join("").length === 0)
      return { error: 'Required field missing' };
    else if (/^(\d|\.)+$/.test(puzzleString.join("")) === false)
      return { error: 'Invalid characters in puzzle' }
    else if (puzzleString.join("").length !== 81)
      return { error: 'Expected puzzle to be 81 characters long' };
    return 'Valid Puzzle String';
  }
  rowToInteger(row) {
    let index = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3,
      "E": 4,
      "F": 5,
      "G": 6,
      "H": 7,
      "I": 8
    }
    return index[row];
  }
  /**
   * take a given puzzle string and check it to see if it has 81 valid characters for the input.
   * @param  {string} puzzleString - sodoku values
   * @return {boolean} true If  puzzleString has 81 valid characters for the input.
   * @example
   * //return true 
   *  validate( '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.') tr
   */



  checkRowPlacement(puzzleString, row, column, value) {


    let rowIndex = /^[0-9]$/.test(row) ? row : this.rowToInteger(row);
    const valueInRow = (puzzleString[rowIndex].includes(`${value}`) && puzzleString[rowIndex].charAt(column - 1) != value);

    return valueInRow === true ? false : true;


  }

  checkColPlacement(puzzleString, row, column, value) {
    column--;//0index
    let rowIndex = /^[0-9]$/.test(row) ? row : this.rowToInteger(row);

    // The some() method tests whether at least one element in the array passes the test implemented by the provided function.
    const valueIncolumn = (puzzleString.some(chunk => chunk.charAt(column) === value) && puzzleString[rowIndex].charAt(column) != value);


    return valueIncolumn === true ? false : true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    column--;//0index


    let rowIndex = /^[0-9]$/.test(row) ? row : this.rowToInteger(row);

    let startRowIndex = rowIndex - (rowIndex % 3);
    let startColumnIndex = column - (column % 3);

    if (puzzleString[rowIndex].charAt(column) == value)
      return true;

    for (let i = startRowIndex; i < startRowIndex + 3; i++) {
      if (puzzleString[i].charAt(startColumnIndex) === value
        || puzzleString[i].charAt(startColumnIndex + 1) === value
        || puzzleString[i].charAt(startColumnIndex + 2) === value)
        return false;
    }
    return true;
  }
  solveRecursiveAlgo(puzzleString, row, col) {
    String.prototype.replaceAt = function(index, character) {
      return this.substr(0, index) + character + this.substr(index + character.length);
    }
    /* If on column 9 (outside row), move to next row and reset column to zero */
    if (col === 9) {
      col = 0
      row++
    }

    /* If on row 9 (outside puzzleString), the solution is complete, so return the puzzleString */
    if (row === 9) {
      return puzzleString
    }

    /* If already filled out (not empty) then skip to next column */
    if (puzzleString[row].charAt(col) !== '.') {
      return this.solveRecursiveAlgo(puzzleString, row, col + 1)
    }

    for (let i = 1; i <= 9; i++) {
      let valueToPlace = i.toString()
      if (
        this.checkRowPlacement(puzzleString, row, col, valueToPlace) &&
        this.checkColPlacement(puzzleString, row, col + 1, valueToPlace) &&
        this.checkRegionPlacement(puzzleString, row, col + 1, valueToPlace)
      ) {
        let tom = puzzleString[row].replaceAt(col, valueToPlace);
        puzzleString[row] = tom;

        if (this.solveRecursiveAlgo(puzzleString, row, col + 1) != false) {
          return puzzleString
        } else {
          let ttom = puzzleString[row].replaceAt(col, '.');
          puzzleString[row] = ttom;
        }
      }
    }
    /* If not found a solution yet, return false */
    return false
  }

  solve(puzzleString) {
    const isvalideString = this.validate(puzzleString);
    if (isvalideString !== 'Valid Puzzle String')
      return isvalideString;

    const solved = this.solveRecursiveAlgo(puzzleString, 0, 0);
    if (solved === false)
      return { error: 'Puzzle cannot be solved' }

    return solved.join("");
  }
}
module.exports = SudokuSolver;


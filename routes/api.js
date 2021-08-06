'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const sudokuSolver = new SudokuSolver();

module.exports = function(app) {

  let solver = new SudokuSolver();
  let solution;

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        res.json({ error: "Required field(s) missing" });
        return;
      }
      else if (/^(\d|\.)+$/.test(puzzle) === false)
        return res.json({ error: 'Invalid characters in puzzle' })
      else if (puzzle.length !== 81)
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      else if (/^[A-I][0-9]$/.test(coordinate) === false)
        return res.json({ error: 'Invalid coordinate' })
      else if (/^[1-9]$/.test(value) === false)
        return res.json({ error: 'Invalid value' })

      const row = coordinate[0];
      const column = coordinate[1];
      const conflict = [];
      puzzle = chunkSubstr(puzzle, 9);

      const isValidRowPlacement = sudokuSolver.checkRowPlacement(puzzle, row, column, value);
      const isValidColumnPlacement = sudokuSolver.checkColPlacement(puzzle, row, column, value);
      const isValidRegionPlacement = sudokuSolver.checkRegionPlacement(puzzle, row, column, value);

      if (isValidRowPlacement === false)
        conflict.push("row");
      if (isValidColumnPlacement === false)
        conflict.push("column");
      if (isValidRegionPlacement === false)
        conflict.push("region");

      if (conflict.length !== 0)
        return res.json({ valid: false, conflict });

      return res.json({ valid: true })

    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle)
        return res.json({ error: 'Required field missing' });

      solution = sudokuSolver.solve(chunkSubstr(puzzle, 9));

      if (typeof solution === 'string')
        res.json({ solution })//{solution:'574...'}

      res.json({ ...solution })//{error:'ABC'}

    });
  /**
   * split a string into chunks of equal size
   * @param {string} str - puzzle String to split
   * @param {integer } size always equal to 9 
   * @return chunks of 9 characters each 
   * @example 
   * return['..9..5.1.', '85.4....2','432......', '1...69.83','.9.....6.', '62.71...9','......194', '5....4.37',.4.3..6..'] 
   * '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
   */
  function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
    }
    return chunks
  }

};

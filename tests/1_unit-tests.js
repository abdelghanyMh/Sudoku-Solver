const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  //  [
  //     '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
  //     '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  //   ]
  test('Logic handles a valid puzzle string of 81 characters', done => {
    // console.log(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'))
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    assert.equal(solver.solve(chunkSubstr('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 9)), solution);
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', done => {
    assert.equal(solver.solve(chunkSubstr('AA5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 9)).error, 'Invalid characters in puzzle');
    done();
  });
  test('Logic handles a puzzle string that is not 81 characters in length', done => {
    //  console.log('5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'.length);//79
    assert.equal(solver.solve(chunkSubstr('5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 9)).error, "Expected puzzle to be 81 characters long");
    done();
  });
  test('Logic handles a valid row placement', done => {
    assert.equal(solver.checkRowPlacement(chunkSubstr('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 9), 'A', '1', '8'), true);
    done();
  })
  test('Logic handles an invalid row placement', done => {
    assert.equal(solver.checkRowPlacement(chunkSubstr('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 9), 'A', '1', '9'), false);
    done();
  })
  test('Logic handles a valid column placement', done => {
    assert.equal(solver.checkColPlacement(chunkSubstr('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 9), 'A', '1', '3'), true);
    done();
  })
  test('Logic handles an invalid column placement', done => {
    assert.equal(solver.checkColPlacement(chunkSubstr('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 9), 'A', '1', '8'), false);
    done();
  })
  test('Logic handles a valid region (3x3 grid) placement', done => {
    assert.equal(solver.checkRegionPlacement(chunkSubstr('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 9), 'A', '1', '7'), true);
    done();
  })
  test('Logic handles an invalid region (3x3 grid) placement', done => {
    assert.equal(solver.checkRegionPlacement(chunkSubstr('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 9), 'A', '1', '8'), false);
    done();
  })
  test('Valid puzzle strings pass the solver', done => {
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    assert.equal(solver.solve(chunkSubstr('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 9)), solution);
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    let inValidPuzzle =
      "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.solve(chunkSubstr(inValidPuzzle, 9)).error, 'Puzzle cannot be solved');
    done();
  });
  test("Solver returns the the expected solution for an incomplete puzzzle", function(done) {
    assert.equal(
      solver.solve(
        chunkSubstr("..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",9)
      ),
      "218396745753284196496157832531672984649831257827549613962415378185763429374928561"
    );
    done();
  });


  function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
      chunks[i] = str.substr(o, size)
    }
    return chunks
  }
});

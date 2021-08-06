const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST requests to /api/solve', () => {
    // '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    test('Solve a puzzle with valid puzzle string', done => {
      chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/json')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, response) => {
          const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';

          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.solution, solution);
          done();
        });

    });
    test('Solve a puzzle with missing puzzle string', done => {
      chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/json')
        .send({ puzzle: "" })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Required field missing');
          done();

        })
    });
    test('Solve a puzzle with invalid characters', done => {
      chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/json')
        .send({ puzzle: 'AAA..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Invalid characters in puzzle');
          done();

        })
    });
    //  console.log('5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'.length);//79
    test('Solve a puzzle with incorrect length', done => {
      chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/json')
        .send({ puzzle: '5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Expected puzzle to be 81 characters long');
          done();

        })
    });

    test('Solve a puzzle that cannot be solved:', done => {
      chai.request(server)
        .post('/api/solve')
        .set('content-type', 'application/json')
        .send({ puzzle: "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Puzzle cannot be solved');
          done();

        })
    });

  
  });

  suite('POST request to /api/check', () => {
    test('Check a puzzle placement with all fields', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '7' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.valid, true);
          done();

        })
    });
    test('Check a puzzle placement with single placement conflict', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '9' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.valid, false);
          assert.isAtLeast(response.body.conflict.length, 1);

          done();

        })
    });
    test('Check a puzzle placement with multiple placement conflicts', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '9' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.valid, false);
          assert.isAtLeast(response.body.conflict.length, 2);

          done();

        })
    });
    test('Check a puzzle placement with invalid placement coordinate', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'WZ', value: '2' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Invalid coordinate');
          done();

        })
    });

    test('Check a puzzle placement with missing required fields', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ coordinate: 'A1', value: '2' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Required field(s) missing');
          done();

        })
    });
    test('Check a puzzle with invalid characters', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: 'AAA..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A1', value: '2' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Invalid characters in puzzle');
          done();

        })
    });
    test('Check a puzzle with incorrect length', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A1', value: '2' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Expected puzzle to be 81 characters long');
          done();

        })
    });
    test('Check a puzzle placement with invalid placement coordinate', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'WZ', value: '2' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Invalid coordinate');
          done();

        })
    });
    test('Check a puzzle placement with invalid placement value', done => {
      chai.request(server)
        .post('/api/check')
        .set('content-type', 'application/json')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', coordinate: 'A1', value: 'W' })
        .end((err, response) => {
          if (err) throw err
          assert.equal(response.status, 200);
          assert.equal(response.body.error, 'Invalid value');
          done();

        })
    });
  });

});


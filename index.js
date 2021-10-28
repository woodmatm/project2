const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();

service.use(express.json());

connection.connect(error => {
  if (error) {
    console.log('Error with connection');
    console.error(error);
    process.exit(1);
  }
});

// define endpoints...

function rowToGrades(row) {
  return {
    id: row.id,
    class: row.class,
    course_id: row.course_id,
    month: row.month,
    year: row.year,
    grade_num: row.grade_num,
    grade_letter: row.grade_letter,
    test_desc: row.test_desc,
  };
}


// Recieve your grade(s) through the month and year
service.get('/grades/:month/:year', (request, response) => {
  const parameters = [
    parseInt(request.params.month),
    parseInt(request.params.year),
  ];


  const query = 'SELECT * FROM grades WHERE month = ? AND year = ? AND is_deleted = 0 ORDER BY year DESC';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      console.log("an error occured");
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const grades = rows.map(rowToGrades);
      response.json({
        ok: true,
        results: rows.map(rowToGrades) ,
      });
    }
  });
});


// Recieve your grade(s) through the class type
service.get('/grades/:class', (request, response) => {
  const parameters = [
    request.params.class,
  ];


  const query = 'SELECT * FROM grades WHERE class = ?  AND is_deleted = 0 ORDER BY month';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      console.log("an error occured");
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const grades = rows.map(rowToGrades);
      response.json({
        ok: true,
        results: rows.map(rowToGrades) ,
      });
    }
  });
});


// Post a new grade to the database
service.post('/grades', (request, response) => {
  if (request.body.hasOwnProperty('class') &&
      request.body.hasOwnProperty('course_id') && request.body.hasOwnProperty('month') &&
      request.body.hasOwnProperty('year') && request.body.hasOwnProperty('grade_num') &&
      request.body.hasOwnProperty('grade_letter') && request.body.hasOwnProperty('test_desc')) {

    const parameters = [
      request.body.class,
      request.body.course_id,
      request.body.month,
      request.body.year,
      request.body.grade_num,
      request.body.grade_letter,
      request.body.test_desc,
    ];

    const query = 'INSERT INTO grades(class, course_id, month, year, grade_num, grade_letter, test_desc) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });

  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete grade entry.',
    });
  }
});

// Modify your grade by the grades entry serial id
service.patch('/grades/:id', (request, response) => {
  const parameters = [
    request.body.class,
    request.body.course_id,
    request.body.month,
    request.body.year,
    request.body.grade_num,
    request.body.grade_letter,
    request.body.test_desc,
    parseInt(request.params.id),
  ];

  const query = 'UPDATE grades SET class = ?, course_id = ?, month = ?, year = ?, grade_num = ?, grade_letter = ?, test_desc = ? WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});


// Delete a grade  by the grades entry serial id 
service.delete('/grades/:id', (request, response) => {
  const parameters = [parseInt(request.params.id)];

  const query = 'UPDATE grades SET is_deleted = 1 WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});

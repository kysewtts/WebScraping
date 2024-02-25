const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../model/user');

exports.postURL = (req, res, next) => {
  const url = req.body.url;

  const firstSemId = 'ctl04_ctl00_';
  const secondSemId = 'ctl04_ctl01_';
  const thirdSemId = 'ctl05_ctl00_';
  const fourthSemId = 'ctl05_ctl01_';
  const fifthSemId = 'ctl06_ctl00_';
  const sixthSemId = 'ctl06_ctl01_';
  const seventhSemId = 'ctl07_ctl00_';
  const eighthSemId = 'ctl07_ctl01_';

  axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const rollno = parseInt($('#lblRollNo').text());

      const name = $('#lblFullName').text();
      const fname = $('#lblFatherName').text();
      const branch = $('#lblBranch').text();
      const gender = $('#lblGender').text();
      const course = $('#lblCourse').text();
      const institute = $('#lblInstitute').text();

      db.query(
        `SELECT * FROM students where rollno=${rollno};`,
        (err, result, fields) => {
          if (err) throw err;
          console.log('Entry already exists');

          if (result.length === 0) {
            const values = [
              [rollno, name, fname, branch, gender, course, institute]
            ];
            db.query(
              'INSERT INTO STUDENTS (rollno, name, fname, branch, gender, course, institute) VALUES ?',
              [values],
              (err, insertResult) => {
                if (err) throw err;
                console.log('Record inserted');

                fetchSemMarks($, rollno, firstSemId, 'firstsem');

                fetchSemMarks($, rollno, secondSemId, 'secondsem');
                fetchSemMarks($, rollno, thirdSemId, 'thirdsem');
                fetchSemMarks($, rollno, fourthSemId, 'fourthsem');
                fetchSemMarks($, rollno, fifthSemId, 'fifthsem');
                fetchSemMarks($, rollno, sixthSemId, 'sixthsem');
                fetchSemMarks($, rollno, seventhSemId, 'seventhsem');
                fetchSemMarks($, rollno, eighthSemId, 'eighthsem');

                res.status(201).json({
                  message: 'New User Created',
                  rollno
                });
              }
            );
          } else {
            res.status(200).json({
              message: 'User already exists!',
              rollno
            });
          }
        }
      );
    })
    .catch(err => {
      console.log('Some error occurred!!!!!!!!!!!!!!!!');
      console.log(err);
    });
};

fetchSemMarks = ($, rollNo, semesterId, tablename) => {
  db.query(
    `SELECT * FROM ${tablename} where rollno=${rollNo}`,
    (err, result) => {
      if (result.length === 0) {
        const checkSemData = $(
          '#' + semesterId + 'ctl00_grdViewSubjectMarksheet' + '> tbody > tr'
        );

        if (checkSemData !== null) {
          const firstSemData = $(
            '#' + semesterId + 'ctl00_grdViewSubjectMarksheet' + '> tbody > tr'
          ).filter(i => {
            return i !== 0;
          });

          let finalArray = [];
          // Code, Name, Type, Internal, External, Back Paper, Grade
          firstSemData.each((i, ele) => {
            const arr = [];
            arr.push(rollNo);
            const children = $(ele).children();
            $(children).each((j, child) => {
              let element = $(child)
                .text()
                .trim();
              if (j === 3 || j === 4) {
                element = parseInt(element);
              }
              arr.push(element);
            });
            finalArray.push(arr);
          });
          console.log(finalArray);
          const values = [...finalArray];
          db.query(
            `INSERT INTO ${tablename} (rollno, subjectcode, subjectname, type, internal, external, backpaper, grade) VALUES ? `,
            [values],
            (err, result) => {
              if (err) throw err;
              fetchTotalSemMarks($, rollNo, semesterId, tablename);
              console.log(tablename + ' entry saved to database successfully');
            }
          );
        } else {
          console.log(`Marks for ${tablename} is not yet published!!`);
          return;
        }
      } else {
        console.log(tablename + ' marks is already present in database');
        return;
      }
    }
  );
};

fetchTotalSemMarks = ($, rollNo, semesterId, semester) => {
  const mapSemesterIdToInteger = {
    firstsem: 1,
    secondsem: 2,
    thirdsem: 3,
    fourthsem: 4,
    fifthsem: 5,
    sixthsem: 6
  };
  const tablename = 'semestertotal';
  db.query(
    `SELECT * FROM ${tablename} where rollno=${rollNo} and semester=${mapSemesterIdToInteger[semester]}`,
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        const marks_obtained = parseInt(
          $('#' + semesterId + 'lblSemesterTotalMarksObtained').text()
        );
        const total_subjects = parseInt(
          $('#' + semesterId + 'lblTotalSubjectsCount').text()
        );
        const total_marks = total_subjects * 100;
        const percentage = Math.round((marks_obtained / total_marks) * 100, 2);
        const values = [
          [
            rollNo,
            mapSemesterIdToInteger[semester],
            marks_obtained,
            total_marks,
            percentage,
            total_subjects
          ]
        ];
        db.query(
          `INSERT INTO ${tablename} (rollno, semester, marks_obtained, total_marks, percentage, total_subjects) VALUES ? `,
          [values],
          (err, result) => {
            if (err) throw err;
            console.log(
              'Total semester marks stored for semester ' +
                mapSemesterIdToInteger[semester]
            );
            return;
          }
        );
      }
    }
  );
};

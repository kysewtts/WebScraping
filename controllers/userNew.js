const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../model/user');
const WEBPAGE_ID = require('../config/id');

const saveController = require('./save');

const MAP_SEMESTER_TO_ID = {
  1: WEBPAGE_ID.FIRST_SEM_BASE_ID,
  2: WEBPAGE_ID.SECOND_SEM_BASE_ID,
  3: WEBPAGE_ID.THIRD_SEM_BASE_ID,
  4: WEBPAGE_ID.FOURTH_SEM_BASE_ID,
  5: WEBPAGE_ID.FIFTH_SEM_BASE_ID,
  6: WEBPAGE_ID.SIXTH_SEM_BASE_ID,
  7: WEBPAGE_ID.SEVENTH_SEM_BASE_ID,
  8: WEBPAGE_ID.EIGHTH_SEM_BASE_ID
};

exports.fetchEntireDetail = (req, res, next) => {
  const url = req.body.url;

  axios
    .get(url, {
      headers: {
        Referer: 'https://erp.aktu.ac.in/webpages/oneview/oneview.aspx'
      }
    })
    .then(response => {
      const $ = cheerio.load(response.data);
      const rollno = $(WEBPAGE_ID.ROLLNO).text();
      const numericRollNo = parseInt(rollno);
      const batch = parseInt(rollno.slice(0, 2));
      const course = $(WEBPAGE_ID.COURSE).text();
      const branch = $(WEBPAGE_ID.BRANCH).text();
      const institute = $(WEBPAGE_ID.INSTITUTE).text();

      const name = $(WEBPAGE_ID.NAME).text();
      const fname = $(WEBPAGE_ID.FNAME).text();
      const gender = $(WEBPAGE_ID.GENDER).text();

      const noOfSemesterTillNow = (
        response.data.match(/ctl00_grdViewSubjectMarksheet"/g) || []
      ).length;
      let i;

      const valuest1 = [[batch, numericRollNo, course, branch, institute, url]];

      //// FIRST QUERY TO RUN IN ORDER TO INSERT A NEW ENTRY IF IT DOES NOT EXISTS
      db.query(
        `SELECT * FROM BATCH_DETAILS WHERE ROLLNO=${numericRollNo}`,
        (errq1, resq1) => {
          if (resq1.length === 0) {
            //SAVE ENTRY IN TABLE 2
            db.query(
              'INSERT INTO batch_details (batch, rollno, course, branch, institute, resulturl) values ?',
              [valuest1],
              (errq2, resq2) => {
                if (errq2) throw errt1;
                console.log('DETAILS INSERTED IN BATCH_DETAILS');

                const valuest2 = [[numericRollNo, name, fname, gender]];

                // SAVING ENTRY IN TABLE 2
                db.query(
                  `INSERT INTO STUDENT_DETAIL (rollno, name, fname, gender) VALUES ? `,
                  [valuest2],
                  (errq3, resq3) => {
                    if (errq3) throw errq3;
                    console.log(
                      'Student Details of rollno ' +
                        rollno +
                        ' saved successfully!!!'
                    );
                    ////SAVING ENTRY IN TABLE 3
                    // db.query('INSERT INTO STUDENT_MARKS')
                    for (i = 1; i <= noOfSemesterTillNow; i++) {
                      saveController.saveSemesterMarks($, i);
                    }
                  }
                );
              }
            );

            return res.status(201).json({
              message: `Entry created for rollno ${rollno}!!!`,
              rollno: numericRollNo
            });
          } else {
            return res.status(200).json({
              message: `Entry for rollno ${rollno} already exists!!!`,
              rollno: numericRollNo
            });
          }
        }
      );
    })
    .catch(err => {
      console.log(err);
    });
};

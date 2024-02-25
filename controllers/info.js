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

exports.getInitialData = (req, res, next) => {
  const id = req.params.id;
  // console.log(id);

  // db.query(
  //   `SELECT BRANCH FROM BATCH_DETAILS WHERE ROLLNO = ${id}`,
  //   (err, branchData) => {
  //     if (err) throw err;
  //     console.log(branchData);
  //     const branch = branchData[0].BRANCH;
  //   }
  // );

  // REWRITING
  db.query(
    `SELECT * FROM STUDENT_DETAIL S NATURAL JOIN BATCH_DETAILS B WHERE S.ROLLNO = ${id} AND B.ROLLNO = ${id}`,
    (errq1, resq1) => {
      if (errq1) throw errq1;
      console.log(resq1);
      // const {
      //   rollno,
      //   name,
      //   fname,
      //   gender,
      //   batch,
      //   course,
      //   branch,
      //   institute,
      //   resulturl
      // } = resq1[0];
      const rollno = resq1[0].rollno;
      const name = resq1[0].name;
      const fname = resq1[0].fname;
      const gender = resq1[0].gender;
      const batch = resq1[0].batch;
      const course = resq1[0].course;
      const branch = resq1[0].branch;
      const institute = resq1[0].institute;
      const resulturl = resq1[0].resulturl;
      return res.status(200).json({
        message: 'User fetched successfully',
        rollno,
        name,
        fname,
        gender,
        batch,
        course,
        branch,
        institute,
        resulturl
      });
    }
  );
};

exports.fetchSemMarks = (req, res, next) => {
  const rollNo = req.params.id;
  const semester = req.params.semester;

  // db.query(
  //   `SELECT BRANCH FROM BATCH_DETAILS WHERE ROLLNO = ${rollNo}`,
  //   (err, branchData) => {
  //     if (err) throw err;
  //     console.log(branchData);
  //     const branch = branchData[0].BRANCH;
  //   }
  // );

  db.query(
    `SELECT BRANCH, BATCH FROM BATCH_DETAILS WHERE ROLLNO = ${rollNo}`,
    (err, batch) => {
      if (err) throw err;
      // console.log(batch[0].BATCH);

      db.query(
        `SELECT * FROM STUDENT_MARKS WHERE ROLLNO = ${rollNo} AND SEMESTER = ${semester}`,
        (err, result) => {
          if (err) throw err;

          if (result.length !== 0) {
            // GETTING ENTIRE SEMESTER DETAILS IN ONE TUPLE INCLUDING MARKS OBTAINED, TOTAL MARKS etc.
            db.query(
              `SELECT * FROM STUDENT_SEMESTER WHERE ROLLNO = ${rollNo} AND SEMESTER = ${semester}`,
              (err, semesterTotalMarks) => {
                if (err) throw err;
                fetchToppersMarks(
                  req,
                  res,
                  result,
                  batch[0].BATCH,
                  batch[0].BRANCH,
                  semesterTotalMarks,
                  next
                );
              }
            );

            console.log('Data fetched successfully!!!');
          } else {
            db.query(
              `SELECT RESULTURL FROM BATCH_DETAILS WHERE ROLLNO = ${rollNo}`,
              (err, url) => {
                axios.get(url[0].RESULTURL).then(response => {
                  const data = response.data;
                  const $ = cheerio.load(data);
                  const queriedSemesterData = $(
                    MAP_SEMESTER_TO_ID[semester] +
                      WEBPAGE_ID.ALL_SUBJECT_MARKS +
                      '_subCode_0'
                  ).text();
                  if (queriedSemesterData) {
                    saveController.saveSemesterMarks($, semester);
                    this.fetchSemMarks(req, res, next);
                  } else {
                    return res.status(200).json({
                      message: 'No data found for this semester',
                      found: 0
                    });
                  }
                });
              }
            );
          }
        }
      );
    }
  );
};

fetchToppersMarks = (
  req,
  res,
  studentResult,
  batch,
  branch,
  semesterTotalMarks,
  next
) => {
  const semester = req.params.semester;

  db.query(
    `SELECT * FROM STUDENT_MARKS WHERE ROLLNO IN(SELECT ROLLNO FROM BATCH_DETAILS NATURAL JOIN STUDENT_SEMESTER WHERE BATCH=${batch} AND BRANCH=\"${branch}\" AND SEMESTER=${semester} AND PERCENTAGE IN (SELECT MAX(PERCENTAGE) FROM BATCH_DETAILS NATURAL JOIN STUDENT_SEMESTER WHERE BATCH=${batch} AND BRANCH = \"${branch}\" AND SEMESTER=${semester})) AND SEMESTER = ${semester}`,
    (err, topperDetails) => {
      if (err) throw err;

      return res.status(200).json({
        message: 'Data fetched successfully!!!',
        found: 1,
        result: [...studentResult],
        topper: [...topperDetails],
        semesterTotalMarks: [...semesterTotalMarks]
      });
    }
  );
};

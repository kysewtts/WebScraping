const WEBPAGE_ID = require('../config/id');
const db = require('../model/user');

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

exports.saveSemesterMarks = ($, semester) => {
  if (
    $(
      MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.ALL_SUBJECT_MARKS + '_subCode_0'
    ).text()
  ) {
    const rollno = parseInt($(WEBPAGE_ID.ROLLNO).text());

    const totalSubjects = parseInt(
      $(MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.SUBJECT_COUNT).text()
    );

    const practicalSubjects = parseInt(
      $(
        MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.PRACTICAL_SUBJECT_COUNT
      ).text()
    );

    const theorySubject = parseInt(
      $(MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.THEORY_SUBJECT_COUNT).text()
    );

    const marksObtained = parseInt(
      $(MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.TOTAL_MARKS_OBTAINED).text()
    );

    const totalMarks = totalSubjects * 100;
    const percentage = parseFloat(
      ((marksObtained / totalMarks) * 100).toFixed(2)
    );
    const resultStatus = $(
      MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.RESULT_STATUS
    ).text();
    const sgpa = parseFloat(
      $(MAP_SEMESTER_TO_ID[semester] + WEBPAGE_ID.SGPA).text()
    );

    const semData = $(
      MAP_SEMESTER_TO_ID[semester] +
        WEBPAGE_ID.ALL_SUBJECT_MARKS +
        '> tbody > tr'
    ).filter(i => i !== 0);
    let finalArray = [];
    semData.each((i, ele) => {
      const arr = [];
      arr.push(rollno);
      arr.push(semester);
      const children = $(ele).children();
      $(children).each((j, child) => {
        let element = $(child)
          .text()
          .trim();
        if (j === 3 || j === 4) {
          element = parseInt(element) || 0;
        }
        arr.push(element);
      });
      finalArray.push(arr);
    });
    const values = [...finalArray];
    console.log(semester, values);
    //QUERY FOR INSERTING MARKS INTO STUDENT MARKS TABLE. IT SAVES MARKS FOR EACH AND EVERY SEMESTER
    db.query(
      `INSERT INTO STUDENT_MARKS (rollno, semester, subjectcode, subjectname, type, internal, external, backpaper, grade) VALUES ? `,
      [values],
      (errq4, resq4) => {
        if (errq4) throw errq4;

        if (errq4) {
          return res.status(501).json({
            message: 'Some error occurred!!!',
            data: errq4
          });
        }

        console.log(
          'Marks entry of roll number ' +
            rollno +
            ' for semester ' +
            semester +
            ' done successfully!!!'
        );
        let student_semester_values = [];

        student_semester_values.push(rollno);
        student_semester_values.push(semester);
        student_semester_values.push(totalSubjects);
        student_semester_values.push(practicalSubjects);
        student_semester_values.push(theorySubject);
        student_semester_values.push(marksObtained);
        student_semester_values.push(totalMarks);
        student_semester_values.push(percentage);
        student_semester_values.push(resultStatus);
        student_semester_values.push(sgpa);

        const values1 = [...student_semester_values];

        //QUERY FOR SAVING STUDENT SEMESTER WISE AGGREGATE PERFORMANCE
        db.query(
          `INSERT INTO STUDENT_SEMESTER (rollno, semester, totalsubjects, practicalsubjects, theorysubjects, marksobtained, totalmarks, percentage, resultstatus, sgpa) VALUES ? `,
          [[values1]],
          (errq5, resq5) => {
            if (errq5) throw errq5;
            console.log(
              'Student Semester wise aggregate performance of roll number ' +
                rollno +
                ' for semester ' +
                semester +
                ' saved successfully!!!'
            );
            return;
          }
        );
      }
    );
  } else {
    return;
  }
};

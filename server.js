// This file is just for testing the dashboard project endpoints

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// All Routes
// const userRoutes = require('./routes/user');
// const infoRoutes = require('./routes/info');

//DATABASE connection
//const db = require('./model/user');

// Body Parsing
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// app.use('/user', userRoutes);
// app.use('/info', infoRoutes);

// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: data });
// });

app.get(`/api/result/stats/personal/:rollNo/:sem/`, (req, res, next) => {
  const rollNo = req.params.rollNo;
  const sem = req.params.sem;

  return res.status(200).json({
    best: {
      semester: 7,
      percentage: 81.5555555555556,
    },
    worst: {
      semester: 4,
      percentage: 66.0,
    },
    college_stats: {
      passed: 100.0,
      failed: 0.0,
    },
    uni_stats: {
      percentage: 79.59386281588448,
    },
    current: {
      semester: 7,
      percentage: 81.5555555555556,
      backlogs: 0,
    },
    highest: {
      sub_code: 'RCS073',
      sub_name: 'HUMAN COMPUTER INTERFACE',
      percentage: 67.0,
    },
    lowest: {
      sub_code: 'RIT701',
      sub_name: 'CRYPTOGRAPHY & NETWORK SECURITY',
      percentage: 44.0,
    },
    donut_chart: {
      ROE074: {
        rel_per: 1.1968633924886505,
        name:
          'UNDERSTANDING THE HUMAN BEING COMPREHENSIVELY – HUMAN  ASPIRATIONS AND ITS FULFILLMENT',
      },
      RCS702: {
        rel_per: 1.0936855138258357,
        name: 'ARTIFICIAL INTELLIGENCE',
      },
      RCS752: {
        rel_per: 1.9191085431283532,
        name: 'ARTIFICIAL INTELLIGENCE LAB',
      },
      RCS073: {
        rel_per: 1.382583574081717,
        name: 'HUMAN COMPUTER INTERFACE',
      },
      RCS077: {
        rel_per: 1.0730499380932728,
        name: 'AGILE SOFTWARE DEVELOPMENT',
      },
      RIT701: {
        rel_per: 0.9079653322327693,
        name: 'CRYPTOGRAPHY & NETWORK SECURITY',
      },
      RIT751: {
        rel_per: 1.960379694593479,
        name: 'CRYPTOGRAPHY & NETWORK SECURITY LAB',
      },
      RIT753: {
        rel_per: 1.8778373916632274,
        name: 'INDUSTRIAL TRAINING',
      },
      RIT754: {
        rel_per: 3.735039207593892,
        name: 'PROJECT',
      },
    },
    trend: {
      personal: [
        { semester: 1, marks: 732.0 },
        { semester: 2, marks: 653.0 },
        { semester: 3, marks: 717.0 },
        { semester: 4, marks: 660.0 },
        { semester: 5, marks: 673.0 },
        { semester: 6, marks: 677.0 },
        { semester: 7, marks: 734.0 },
      ],
      topper: [
        { semester: 1, marks: 775.0 },
        { semester: 2, marks: 822.0 },
        { semester: 3, marks: 873.0 },
        { semester: 4, marks: 894.0 },
        { semester: 5, marks: 871.0 },
        { semester: 6, marks: 855.0 },
        { semester: 7, marks: 886.0 },
      ],
    },
  });
});

app.get(`/api/result/:rollNo/:sem/`, (req, res, next) => {
  const rollNo = req.params.rollNo;
  const sem = req.params.sem;
  return res.status(200).json({
    student: {
      id: 14,
      first_name: 'Anish',
      roll_no: 1613313015,
    },
    marks: [
      {
        id: 300,
        subject: {
          code: 'ROE074',
          name:
            'UNDERSTANDING THE HUMAN BEING COMPREHENSIVELY – HUMAN  ASPIRATIONS AND ITS FULFILLMENT',
          is_core: true,
          is_theory: true,
        },
        internal: 25.0,
        external: 33.0,
        maximum: 100.0,
        back: false,
        total: 58.0,
        grade: 'C',
      },
      {
        id: 304,
        subject: {
          code: 'RCS702',
          name: 'ARTIFICIAL INTELLIGENCE',
          is_core: true,
          is_theory: true,
        },
        internal: 22.0,
        external: 31.0,
        maximum: 100.0,
        back: false,
        total: 53.0,
        grade: 'C',
      },
      {
        id: 306,
        subject: {
          code: 'RCS752',
          name: 'ARTIFICIAL INTELLIGENCE LAB',
          is_core: true,
          is_theory: false,
        },
        internal: 48.0,
        external: 45.0,
        maximum: 100.0,
        back: false,
        total: 93.0,
        grade: 'A+',
      },
      {
        id: 301,
        subject: {
          code: 'RCS073',
          name: 'HUMAN COMPUTER INTERFACE',
          is_core: true,
          is_theory: true,
        },
        internal: 26.0,
        external: 41.0,
        maximum: 100.0,
        back: false,
        total: 67.0,
        grade: 'B',
      },
      {
        id: 302,
        subject: {
          code: 'RCS077',
          name: 'AGILE SOFTWARE DEVELOPMENT',
          is_core: true,
          is_theory: true,
        },
        internal: 21.0,
        external: 31.0,
        maximum: 100.0,
        back: false,
        total: 52.0,
        grade: 'C',
      },
      {
        id: 303,
        subject: {
          code: 'RIT701',
          name: 'CRYPTOGRAPHY & NETWORK SECURITY',
          is_core: true,
          is_theory: true,
        },
        internal: 21.0,
        external: 23.0,
        maximum: 100.0,
        back: false,
        total: 44.0,
        grade: 'E',
      },
      {
        id: 305,
        subject: {
          code: 'RIT751',
          name: 'CRYPTOGRAPHY & NETWORK SECURITY LAB',
          is_core: true,
          is_theory: false,
        },
        internal: 47.0,
        external: 48.0,
        maximum: 100.0,
        back: false,
        total: 95.0,
        grade: 'A+',
      },
      {
        id: 307,
        subject: {
          code: 'RIT753',
          name: 'INDUSTRIAL TRAINING',
          is_core: true,
          is_theory: false,
        },
        internal: 91.0,
        external: 0.0,
        maximum: 100.0,
        back: false,
        total: 91.0,
        grade: 'A+',
      },
      {
        id: 308,
        subject: {
          code: 'RIT754',
          name: 'PROJECT',
          is_core: true,
          is_theory: false,
        },
        internal: 181.0,
        external: 0.0,
        maximum: 100.0,
        back: false,
        total: 181.0,
        grade: 'A+',
      },
    ],
    th_subjects: 5,
    pr_subjects: 4,
    total_marks: 734.0,
    practical_marks: 460.0,
    theory_marks: 274.0,
    total_outof: 900.0,
    total_outof_th: 500.0,
    total_outof_pr: 400.0,
  });
});

// db.connect((err) => {
//   if (err) throw err;
//   app.listen(8000, '192.168.0.103', () => {
//     console.log('Server now listening on port 8000');
//   });
// });

app.listen(8000, () => {
  console.log('Server is listening at port 8000');
});

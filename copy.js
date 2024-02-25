const axios = require('axios');
const cheerio = require('cheerio');
// const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const fileName = path.join(__dirname, 'marks.csv');

const csvWriter = createCsvWriter({
  path: fileName,
  header: [
    { id: 'code', title: 'Code' },
    { id: 'name', title: 'Name' },
    { id: 'type', title: 'Type' },
    { id: 'internal', title: 'Internal' },
    { id: 'external', title: 'External' },
    { id: 'backpaper', title: 'Back Paper' },
    { id: 'grade', title: 'Grade' }
  ]
});

const data = [];

const url =
  'https://erp.aktu.ac.in/webpages/oneview/OVEngine.aspx?enc=NnCOpTxI4+e2v6OtxoLaISHE7OTs9vO5s5nuhHpZwYxCJ6i8L2gcV7TeTA/xPUv+';

axios
  .get(url)
  .then(async res => {
    const $ = cheerio.load(res.data);

    const filteredElements1 = $(
      '#ctl04_ctl00_ctl00_grdViewSubjectMarksheet > tbody > tr'
    ).filter(i => {
      return i !== 0;
    });
    console.log(filteredElements1.length);

    filteredElements1.each((i, ele) => {
      //   const values = [];
      const obj = {};
      const children = $(ele).children();
      $(children).each((j, child) => {
        if (j === 0) {
          obj['code'] = $(child)
            .text()
            .trim();
        } else if (j === 1) {
          obj['name'] = $(child)
            .text()
            .trim();
        } else if (j === 2) {
          obj['type'] = $(child)
            .text()
            .trim();
        } else if (j === 3) {
          obj['internal'] = $(child)
            .text()
            .trim();
        } else if (j === 4) {
          obj['external'] = $(child)
            .text()
            .trim();
        } else if (j === 5) {
          obj['backpaper'] = $(child)
            .text()
            .trim();
        } else if (j === 6) {
          obj['grade'] = $(child)
            .text()
            .trim();
        }
      });
      data.push(obj);
    });
    const fileSaveStatus = await saveFile();
    if (fileSaveStatus === 1) {
      console.log('File saved successfully');
    } else {
      console.log('Some error encountered');
    }
  })
  .catch(err => {
    console.log(err);
  });

saveFile = async () => {
  csvWriter
    .writeRecords(data)
    .then(() => {
      return 1;
    })
    .catch(err => {
      return 0;
    });
};

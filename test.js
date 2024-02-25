const cheerio = require('cheerio');
const axios = require('axios');

// const url =
//   'https://erp.aktu.ac.in/webpages/oneview/OVEngine.aspx?enc=NnCOpTxI4+e2v6OtxoLaIVwWeWm5rXdkvq9Now4PabSB3fUmrhlhTdNCWrHw+wm/';

const url =
  'https://erp.aktu.ac.in/webpages/oneview/OVEngine.aspx?enc=NnCOpTxI4+e2v6OtxoLaISHE7OTs9vO5s5nuhHpZwYxCJ6i8L2gcV7TeTA/xPUv+';

axios
  .get(url)
  .then(res => {
    // console.log(res);
    const $ = cheerio.load(res.data);
    const d = $('#ctl07_ctl00_ctl00_grdViewSubjectMarksheet > tbody > tr');
    console.log(d.html());
  })
  .catch(err => console.log(err));

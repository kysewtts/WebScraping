const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'niet@1234',
  database: 'analysis'
});

module.exports = connection;

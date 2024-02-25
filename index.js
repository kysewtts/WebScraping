const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// All Routes
const userRoutes = require('./routes/user');
const infoRoutes = require('./routes/info');

//DATABASE connection
const db = require('./model/user');

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

app.use('/user', userRoutes);
app.use('/info', infoRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: data });
});

db.connect(err => {
  if (err) throw err;
  app.listen(8000, () => {
    console.log('Server now listening on port 8000');
  });
});

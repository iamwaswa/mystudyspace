const express = require('express');
const mongoose = require('mongoose');
const StudySpace = require('./src/public/scripts/models');

/**
 * Mongoose Setup
 */

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

/**
 * Express Setup
 */

const app = express();
app.use(express.static(`${__dirname}/src/public`));
app.set(`view engine`, `ejs`);

app.get(`/`, (req, res) => {
  res.render(`pages/index`);
});

app.get(`/studyspaces`, async (req, res) => {
  const studyspaces = await StudySpace.find({});
  res.render(`pages/studyspaces`, { studyspaces });
});

app.get(`/studyspaces/new`, (req, res) => {
  res.render(`pages/new`);
});

app.get(`/*`, (req, res) => {
  res.send(`The page you are looking for does not exist!`);
});

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
Press Ctrl + C to stop the server!`);
});
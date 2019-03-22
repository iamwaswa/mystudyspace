const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const StudySpace = require('./src/public/scripts/models');
const getPlaceDetailsAsync = require('./src/public/scripts/create');
const searchForPlaceAsync = require('./src/public/scripts/search');

/**
 * Mongoose Setup
 */

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, autoIndex: false });

/**
 * Express Setup
 */

const app = express();
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.urlencoded({extended: true}));
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

app.post(`/studyspaces/new`, async (req, res) => {

  let studyspace;
  if (req.body.placeId) {
    studyspace = await getPlaceDetailsAsync(req.body.placeId);
  } else if (req.body.place) {
    studyspace = await searchForPlaceAsync(req.body.place);
  }

  const studyspaceExists = await StudySpace.findOne({ 
    name: studyspace.name,
    address: studyspace.address,
    postalCode: studyspace.postalCode,
  });

  if (!studyspaceExists && studyspace) {
    await StudySpace.create({ ...studyspace });
  }
  
  res.redirect(`/studyspaces`);
});

app.get(`/studyspaces/:_id`, async (req, res) => {
  const studyspace = await StudySpace.findById(req.params._id);
  const studyspaces = await StudySpace.find({});
  res.render(`pages/studyspace`, { studyspace, studyspaces });
});

app.get(`/*`, (req, res) => {
  res.send(`The page you are looking for does not exist!`);
});

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
Press Ctrl + C to stop the server!`);
});
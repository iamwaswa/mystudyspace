const express = require('express');
const StudySpace = require('./models/studyspace');
const getPlaceDetailsAsync = require('./create');
const searchForPlaceAsync = require('./search');

const router = express.Router();

router.get(`/`, (req, res) => {
  res.render(`pages/index`);
});

router.get(`/studyspaces`, async (req, res) => {
  const studyspaces = await StudySpace.find({});
  res.render(`pages/studyspaces`, {
    studyspaces
  });
});

router.get(`/studyspaces/new`, (req, res) => {
  res.render(`pages/new`);
});

router.post(`/studyspaces/new`, async (req, res) => {

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
    await StudySpace.create({
      ...studyspace
    });
  }

  res.redirect(`/studyspaces`);
});

router.get(`/studyspaces/:_id`, async (req, res) => {
  const studyspace = await StudySpace.findById(req.params._id);
  const studyspaces = await StudySpace.find({});
  res.render(`pages/studyspace`, {
    studyspace,
    studyspaces
  });
});

router.get(`/*`, (req, res) => {
  res.send(`The page you are looking for does not exist!`);
});

module.exports = router;
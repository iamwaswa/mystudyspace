const express = require('express');
const StudySpace = require('./models/studyspace');
const Comment = require('./models/comment');
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

router.post(`/studyspaces`, async (req, res) => {

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

router.get(`/studyspaces/new`, (req, res) => {
  res.render(`pages/new`);
});

router.get(`/studyspaces/:_id`, async (req, res) => {
  const studyspace = await StudySpace.findById(req.params._id);
  const studyspaces = await StudySpace.find({});
  const comments = await Comment.find({});

  res.render(`pages/studyspace`, {
    studyspace,
    studyspaces,
    comments,
  });
});

router.post(`/studyspace/:_id/comments`, async (req, res) => {
  if (req.body.comment) {
    await Comment.create({
      text: req.body.comment,
    });
  }

  res.redirect(`/studyspaces/${req.params._id}`);
});

router.get(`/*`, (req, res) => {
  res.send(`The page you are looking for does not exist!`);
});

module.exports = router;
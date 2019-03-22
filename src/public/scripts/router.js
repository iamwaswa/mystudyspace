const express = require('express');
const StudySpace = require('./models/studyspace');
const Comment = require('./models/comment');
const User = require('./models/user');
const getPlaceDetailsAsync = require('./create');
const searchForPlaceAsync = require('./search');

const router = express.Router();

const FLASH_KEY = `info`;

router.get(`/`, (req, res) => {
  res.render(`pages/index`, { message: req.flash(FLASH_KEY) });
});

router.get(`/signup`, (req, res) => {
  res.render(`pages/signup`, { message: req.flash(FLASH_KEY) });
});

router.post(`/signup`, async (req, res) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound) {
      req.flash(FLASH_KEY, `Username already exists. Please choose a different one`);
      res.redirect(`/signup`);
      return;
    }
    
    await User.create({ username: req.body.username, password: req.body.password });
    req.flash(FLASH_KEY, `Hello ${req.body.username}!`);
    res.redirect(`/`);
  } catch (error) {
    console.error(error);
  }
});

router.get(`/studyspaces`, async (req, res) => {
  try {
    const studyspaces = await StudySpace.find({});
    res.render(`pages/studyspaces`, { studyspaces });
  } catch (error) {
    console.error(error);
  }
});

router.get(`/studyspaces/new`, (req, res) => {
  res.render(`pages/new`);
});

router.post(`/studyspaces`, async (req, res) => {

  try {
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
  } catch (error) {
    console.error(error);
  }
});

router.get(`/studyspaces/:_id`, async (req, res) => {
  try {
    const studyspace = await StudySpace.findById(req.params._id);
    const studyspaces = await StudySpace.find({});
    const comments = await Comment.find({ studyspace: req.params._id });
  
    res.render(`pages/studyspace`, {
      studyspace,
      studyspaces,
      comments,
    });
  } catch (error) {
    console.error(error);
  }
});

router.post(`/studyspaces/:_id/comments`, async (req, res) => {
  try {
    if (req.body.comment) {
      await Comment.create({
        studyspace: req.params._id,
        text: req.body.comment,
      });
    }
  
    res.redirect(`/studyspaces/${req.params._id}`);
  } catch (error) {
    console.error(error);
  }
});

router.get(`/studyspaces/:_id/comments/:comment_id/edit`, async (req, res) => {
  try {
    const { text } = await Comment.findById(req.params.comment_id);
  
    res.render(`pages/editcomment`, {
      studyspaceId: req.params._id,
      commentId: req.params.comment_id,
      comment: text,
    });
  } catch (error) {
    console.error(error);
  }
});

router.put(`/studyspaces/:_id/comments/:comment_id`, async (req, res) => {
  try {
    await Comment.findOneAndUpdate({ _id: req.params.comment_id }, { text: req.body.comment });
    res.redirect(`/studyspaces/${req.params._id}`);
  } catch (error) {
    console.error(error);
  }
});

router.delete(`/studyspaces/:_id/comments/:comment_id`, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.comment_id);
    res.redirect(`/studyspaces/${req.params._id}`);
  } catch (error) {
    console.error(error);
  }
});

router.get(`/*`, (req, res) => {
  res.send(`The page you are looking for does not exist!`);
});

module.exports = router;
const express = require('express');
const passport = require('../config/passport');
const StudySpace = require('../models/studyspace');
const Comment = require('../models/comment');
const User = require('../models/user');
const getPlaceDetailsAsync = require('../utils/create');
const searchForPlaceAsync = require('../utils/search');
const { signUpAsync } = require('../config/bcrypt');

const router = express.Router();

router.get(`/`, (req, res) => {
  res.render(`pages/index`, { message: req.flash() });
});

router.get(`/signup`, (req, res) => {
  res.render(`pages/signup`, { message: req.flash() });
});

router.post(`/signup`, async (req, res) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound) {
      req.flash().error = `Username already exists. Please choose a different one!`;
      res.redirect(`/signup`);
      return;
    }

    await signUpAsync(req.body.username, req.body.password);
  } catch (error) {
    console.error(error);
  }
});

router.get(`/login`, (req, res) => {
  res.render(`pages/login`, { message: req.flash() });
});

router.post(`/login`, passport.authenticate(`local`, {
    successRedirect: `/`,
    failureRedirect: `/login`,
    successFlash: true,
    failureFlash: true,
  })
);

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
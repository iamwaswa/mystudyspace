const StudySpace = require('../models/studyspace');
const Comment = require('../models/comment');
const getPlaceDetailsAsync = require('../utils/create');
const searchForPlaceAsync = require('../utils/search');

const initializeRoutes = (router, passport) => {

  // =====================================
  // INDEX HOME ==========================
  // =====================================

  router.get(`/`, (req, res) => {
    res.render(`pages/index`, { message: req.flash() });
  });
  
  // =====================================
  // INDEX SIGNUP ========================
  // =====================================

  router.get(`/signup`, (req, res) => {
    res.render(`pages/signup`, { message: req.flash() });
  });

  // =====================================
  // SIGNUP AUTHENTICATION ===============
  // =====================================
  
  router.post(`/signup`, passport.authenticate(`local-login`, {
    successRedirect: `/`,
    failureRedirect: `/signup`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // INDEX LOGIN =========================
  // =====================================
  
  router.get(`/login`, (req, res) => {
    res.render(`pages/login`, { message: req.flash() });
  });

  // =====================================
  // LOGIN AUTHENTICATION ================
  // =====================================
  
  router.post(`/login`, passport.authenticate(`local-login`, {
    successRedirect: `/`,
    failureRedirect: `/login`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // INDEX STUDYSPACES ===================
  // =====================================
  
  router.get(`/studyspaces`, async (req, res) => {
    try {
      const studyspaces = await StudySpace.find({});
      res.render(`pages/studyspaces`, { studyspaces });
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // NEW STUDYSPACE ======================
  // =====================================
  
  router.get(`/studyspaces/new`, (req, res) => {
    res.render(`pages/new`);
  });

  // =====================================
  // CREATE STUDYSPACE ===================
  // =====================================
  
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

  // =====================================
  // SHOW STUDYSPACE =====================
  // =====================================
  
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

  // =====================================
  // CREATE COMMENT ======================
  // =====================================
  
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

  // =====================================
  // EDIT COMMENT ========================
  // =====================================
  
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

  // =====================================
  // UPDATE COMMENT ======================
  // =====================================
  
  router.put(`/studyspaces/:_id/comments/:comment_id`, async (req, res) => {
    try {
      await Comment.findOneAndUpdate({ _id: req.params.comment_id }, { text: req.body.comment });
      res.redirect(`/studyspaces/${req.params._id}`);
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // DELETE COMMENT ======================
  // =====================================
  
  router.delete(`/studyspaces/:_id/comments/:comment_id`, async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.comment_id);
      res.redirect(`/studyspaces/${req.params._id}`);
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // INDEX NOT FOUND =====================
  // =====================================
  
  router.get(`/*`, (req, res) => {
    res.send(`The page you are looking for does not exist!`);
  });
};


module.exports = initializeRoutes;
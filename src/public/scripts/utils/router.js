const StudySpace = require('../models/studyspace');
const Comment = require('../models/comment');
const User = require('../models/user');
const getPlaceDetailsAsync = require('../utils/create');
const searchForPlaceAsync = require('../utils/search');
const getTimeDescription = require('../utils/date');

const initializeRoutes = (router, passport) => {

  const SUCCESS_FLASH_KEY = `success`;
  const ERROR_FLASH_KEY = `error`;
  const DEFAULT_FLASH_KEY = `default`;

  // =====================================
  // INDEX HOME ==========================
  // =====================================

  router.get(`/`, (req, res) => {
    return res.render(`pages/index`, { message: req.flash() });
  });
  
  // =====================================
  // INDEX SIGNUP ========================
  // =====================================

  router.get(`/signup`, (req, res) => {
    if (req.user) {
      req.flash(
        SUCCESS_FLASH_KEY, 
        `You don't need to sign up. You're already logged in as ${req.user.username}`
      );
      return res.redirect(`/`);
    }

    return res.render(`pages/signup`, { message: req.flash() });
  });

  // =====================================
  // SIGNUP AUTHENTICATION ===============
  // =====================================
  
  router.post(`/signup`, passport.authenticate(`local-signup`, {
    successRedirect: `/`,
    failureRedirect: `/signup`,
    successFlash: true,
    failureFlash: true,
  }));

  // =====================================
  // INDEX LOGIN =========================
  // =====================================
  
  router.get(`/login`, (req, res) => {
    if (req.user) {
      req.flash(
        SUCCESS_FLASH_KEY, 
        `You don't need to login. You're already logged in as ${req.user.username}`
      );
      return res.redirect(`/`);
    }

    return res.render(`pages/login`, { message: req.flash() });
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
  // INDEX LOGOUT ========================
  // =====================================

  router.get(`/logout`, (req, res) => {
    if (!req.user) {
      req.flash(ERROR_FLASH_KEY, `You are not logged in!`);
      return res.redirect(`/login`);
    }
    
    req.logout();
    req.flash(SUCCESS_FLASH_KEY, `You have been logged out`);
    return res.redirect(`/`);
  });

  // =====================================
  // INDEX STUDYSPACES ===================
  // =====================================
  
  router.get(`/studyspaces`, async (req, res) => {
    try {
      const studyspaces = await StudySpace.find({});
      return res.render(`pages/studyspaces`, { studyspaces });
    } catch (error) {
      console.error(error);
    }
  });

  router.get(`/prompt`, (req, res) => {
    res.render(`pages/prompt`);
  });

  router.post(`/prompt`, (req, res) => {
    const physicalAddress = req.body.physical;
    const postalCode = req.body.postal || ``;
    const city = req.body.city || ``;
    const province = req.body.province || ``;
    const country = `Canada`;
    // ! Fetch location using address
    res.redirect(`/studyspaces/new`);
  });

  // =====================================
  // NEW STUDYSPACE ======================
  // =====================================
  
  router.get(`/studyspaces/new`, (req, res) => {
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to add a new studyspace`);
      return res.redirect(`/signup`);
    }

    return res.render(`pages/new`);
  });

  // =====================================
  // CREATE STUDYSPACE ===================
  // =====================================
  
  router.post(`/studyspaces`, async (req, res) => {
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to create a new studyspace`);
      return res.redirect(`/signup`);
    }
  
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
    
      return res.redirect(`/studyspaces`); 
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // SHOW STUDYSPACE =====================
  // =====================================
  
  router.get(`/studyspaces/:_id`, async (req, res) => {
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to view a studyspace`);
      return res.redirect(`/signup`);
    }

    try {
      const studyspace = await StudySpace.findById(req.params._id);
      const studyspaces = await StudySpace.find({});
      const comments = await Comment.find({ studyspaceId: req.params._id });
      const dates = comments.map(({ created }) => {
        return getTimeDescription(created);
      });
      const authors = comments.map((comment) => {
        return comment.author;
      });

      return res.render(`pages/studyspace`, {
        user: req.user,
        studyspace,
        studyspaces,
        comments,
        dates,
        authors,
      });
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // CREATE COMMENT ======================
  // =====================================
  
  router.post(`/studyspaces/:_id/comments`, async (req, res) => {
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to create a new comment`);
      return res.redirect(`/signup`);
    }

    try {
      if (req.body.comment) {
        const { username } = await User.findById(req.user._id);
        await Comment.create({
          author: username,
          studyspaceId: req.params._id,
          text: req.body.comment,
          created: Date.now(),
        });
      }
    
      return res.redirect(`/studyspaces/${req.params._id}`);
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // EDIT COMMENT ========================
  // =====================================
  
  router.get(`/studyspaces/:_id/comments/:comment_id/edit`, async (req, res) => {
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to edit a comment`);
      return res.redirect(`/signup`);
    }

    try {
      const { text } = await Comment.findById(req.params.comment_id);
    
      return res.render(`pages/editcomment`, {
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
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to update a comment`);
      return res.redirect(`/signup`);
    }

    try {
      await Comment.findOneAndUpdate({ _id: req.params.comment_id }, { text: req.body.comment });
      return res.redirect(`/studyspaces/${req.params._id}`);
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // DELETE COMMENT ======================
  // =====================================
  
  router.delete(`/studyspaces/:_id/comments/:comment_id`, async (req, res) => {
    if (!req.user) {
      req.flash(DEFAULT_FLASH_KEY, `You need an account to delete a comment`);
      return res.redirect(`/signup`);
    }

    try {
      await Comment.findByIdAndDelete(req.params.comment_id);
      return res.redirect(`/studyspaces/${req.params._id}`);
    } catch (error) {
      console.error(error);
    }
  });

  // =====================================
  // INDEX NOT FOUND =====================
  // =====================================
  
  router.get(`/*`, (req, res) => {
    return res.redirect(`/`);
  });
};

module.exports = initializeRoutes;
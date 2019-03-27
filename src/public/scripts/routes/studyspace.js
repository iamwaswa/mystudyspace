const { DEFAULT_FLASH_KEY } = require('./router');
const { searchForPlaceAsync } = require('../utils/search');
const getPlaceDetailsAsync = require('../utils/create');
const StudySpace = require('../models/studyspace');
const Comment = require('../models/comment');
const getTimeDescription = require('../utils/date');

const initializeStudySpaceRoutes = (router) => {
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
      const comments = await Comment.find({
        studyspaceId: req.params._id
      });
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
};

module.exports = initializeStudySpaceRoutes;
const { DEFAULT_FLASH_KEY } = require('./router');
const User = require('../models/user');
const Comment = require('../models/comment');

const initializeCommentRoutes = (router) => {
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
        const {
          username
        } = await User.findById(req.user._id);
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
      const {
        text
      } = await Comment.findById(req.params.comment_id);

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
      await Comment.findOneAndUpdate({ _id: req.params.comment_id }, {
        text: req.body.comment
      });
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
};

module.exports = initializeCommentRoutes;
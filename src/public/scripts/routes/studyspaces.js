const StudySpace = require('../models/studyspace');

const initializeStudySpacesRoutes = (router) => {
  // =====================================
  // STUDYSPACES ===================
  // =====================================

  router.get(`/studyspaces`, async (req, res) => {
    try {
      const studyspaces = await StudySpace.find({});
      return res.render(`pages/studyspaces`, {
        studyspaces
      });
    } catch (error) {
      console.error(error);
    }
  });
};

module.exports = initializeStudySpacesRoutes;
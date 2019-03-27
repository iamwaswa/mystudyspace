const studyspacesRoutes = require(`express`).Router();
const StudySpace = require(`../models/studyspace`);

// =====================================
// STUDYSPACES ===================
// =====================================
studyspacesRoutes.get(`/studyspaces`, async (req, res) => {
  try {
    const studyspaces = await StudySpace.find({});
    return res.render(`pages/studyspaces`, {
      studyspaces
    });
  } catch (error) {
    console.error(error);
  }
});

module.exports = studyspacesRoutes;
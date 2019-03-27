const notFoundRoutes = require(`express`).Router();

// =====================================
// NOT FOUND ===========================
// =====================================
notFoundRoutes.get(`/*`, (req, res) => {
  return res.redirect(`/`);
});

module.exports = notFoundRoutes;
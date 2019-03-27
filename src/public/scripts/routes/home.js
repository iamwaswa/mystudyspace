const homeRoutes = require(`express`).Router();

// =====================================
// HOME ================================
// =====================================
homeRoutes.get(`/`, (req, res) => {
  return res.render(`pages/index`, {
    message: req.flash()
  });
});

module.exports = homeRoutes;
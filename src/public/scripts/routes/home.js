const initializeHomeRoutes = (router) => {
  // =====================================
  // HOME ================================
  // =====================================

  router.get(`/`, (req, res) => {
    return res.render(`pages/index`, {
      message: req.flash()
    });
  });
};

module.exports = initializeHomeRoutes;
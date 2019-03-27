const initializeNotFoundRoutes = (router) => {
  // =====================================
  // NOT FOUND ===========================
  // =====================================
  
  router.get(`/*`, (req, res) => {
    return res.redirect(`/`);
  });
};

module.exports = initializeNotFoundRoutes;
const { geolocateAddressAsync } = require('../utils/search');

const initializePromptRoutes = (router) => {
  // =====================================
  // PROMPT ========================
  // =====================================

  router.get(`/prompt`, (req, res) => {
    res.render(`pages/prompt`);
  });

  // =====================================
  // PROMPT CONFIRMATION =================
  // =====================================

  router.post(`/prompt`, async (req, res) => {
    const address = {};
    address.streetAddress = req.body.streetAddress;
    address.postalCode = req.body.postalCode || ``;
    address.city = req.body.city || ``;
    address.province = req.body.province || ``;
    address.country = `Canada`;
    const position = await geolocateAddressAsync(address);

    res.redirect(`/studyspaces/new`);
  });
};

module.exports = initializePromptRoutes;
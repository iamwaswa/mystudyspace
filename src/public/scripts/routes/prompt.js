const promptRoutes = require(`express`).Router();
const { geolocateAddressAsync } = require(`../utils/search`);

// =====================================
// PROMPT ========================
// =====================================
promptRoutes.get(`/prompt`, (req, res) => {
  res.render(`pages/prompt`);
});

// =====================================
// PROMPT CONFIRMATION =================
// =====================================
promptRoutes.post(`/prompt`, async (req, res) => {
  const address = {};
  address.streetAddress = req.body.streetAddress;
  address.postalCode = req.body.postalCode || ``;
  address.city = req.body.city || ``;
  address.province = req.body.province || ``;
  address.country = `Canada`;
  const position = await geolocateAddressAsync(address);
  const stringifyPosition = JSON.stringify(position);

  res.redirect(`/studyspaces/new/${stringifyPosition}`);
});

module.exports = promptRoutes;
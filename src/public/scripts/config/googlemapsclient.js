const GoogleMaps = require(`@google/maps`);

module.exports = GoogleMaps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

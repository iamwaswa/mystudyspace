const googleMapsClient = require('./client');
const getStudySpaceDetailsAsync = require('./create');

const searchForPlaceAsync = async (place) => {
  if (place) {
    const request = {
      input: place,
      inputtype: `textquery`,
    };
  
    const { place_id } = await googleMapsClient.findPlace(request).asPromise();
    return getStudySpaceDetailsAsync(place_id);
  }
};

module.exports = searchForPlaceAsync;
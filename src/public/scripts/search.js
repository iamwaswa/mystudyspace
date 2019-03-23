const googleMapsClient = require('./utils/client');
const getStudySpaceDetailsAsync = require('./create');

const searchForPlaceAsync = async (place) => {
  const request = {
    input: place,
    inputtype: `textquery`,
  };

  const { json: { status, candidates } } = await googleMapsClient.findPlace(request).asPromise();
  const [ firstCandidate ] = candidates;
  
  if (status === `OK`) {
    return getStudySpaceDetailsAsync(firstCandidate.place_id);
  }
};

module.exports = searchForPlaceAsync;
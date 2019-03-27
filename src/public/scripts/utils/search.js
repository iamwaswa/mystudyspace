const googleMapsClient = require(`../config/googlemapsclient`);
const getStudySpaceDetailsAsync = require(`./create`);

const searchForPlaceAsync = async (place) => {
  try {
    const request = {
      input: place,
      inputtype: `textquery`,
    };
  
    const { json: { status, candidates } } = await googleMapsClient.findPlace(request).asPromise();
    
    if (status === `OK`) {
      const [ firstCandidate ] = candidates;
      return getStudySpaceDetailsAsync(firstCandidate.place_id);
    }
  } catch (error) {
    console.error(error);
  }
};

const geolocateAddressAsync = async (address) => {
  try {
    const formattedAddress = formatAddress(address);
    const request = {
      address: formattedAddress,
    };
  
    const { json: { status, results } } = await googleMapsClient.geocode(request).asPromise();
    
    if (status === `OK`) {
      const [ firstResult ] = results;
      const { geometry: { location } } = firstResult;
      return location;
    }
  } catch (error) {
    console.error(error);
  }
};

const formatAddress = (address) => {
  let result = address.streetAddress;

  if (address.city) {
    result += `, ${address.city}`;
  }

  if (address.province) {
    result += `, ${address.province}`;
  }

  if (address.postalCode) {
    result += ` ${address.postalCode}`;
  }

  result += `, ${address.country}`;

  return result;
};

module.exports = {
  searchForPlaceAsync,
  geolocateAddressAsync,
};
const GoogleMaps = require('@google/maps');

const googleMapsClient = GoogleMaps.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

const extractAddressObject = (address) => {
  const trimmed = address.trim();
  const array = trimmed.split(`</span>`);
  const filteredArray = array.filter((entry) => {
    return entry.indexOf(`span`) !== -1;
  });

  return filteredArray.reduce((mappedAddress,  entry) => {
    const commaIndex = entry.indexOf(`,`);
    const commaRemoved = entry.substring(commaIndex + 1);

    const spaceRemoved = commaRemoved.trim();
    const endSpanIndex = spaceRemoved.indexOf(`>`);

    const classIndex = spaceRemoved.indexOf(`class=`);
    const nameStartIndex = classIndex + 7;
    const nameEndIndex = spaceRemoved.indexOf(`">`);
    const name = spaceRemoved.substring(nameStartIndex, nameEndIndex);

    const spanRemoved = spaceRemoved.substring(endSpanIndex + 1);

    if (name !== `country-name`) {
      mappedAddress[name] = spanRemoved.trim();
    }

    return mappedAddress;
  }, {});
};

const createStudySpaceObjectAsync = async (result) => {
  const addressObject = extractAddressObject(result.adr_address);

  const photo = {
    url: ``,
  };

  const request = {
    photoreference: result.photos[0].photo_reference,
    maxwidth: 1600,
    maxheight: 1600,
  };

  try {
    photo.url = await googleMapsClient.placesPhoto(request).asPromise();
    
    return {
      name: result.name,
      type: result.types[0],
      address: addressObject[`street-address`],
      postalCode: addressObject[`postal-code`],
      city: addressObject[`locality`],
      province: addressObject[`region`],
      website: result.website,
      phone: result.formatted_phone_number,
      image: photo.url,
      rating: result.rating,
    };
  } catch (error) {
    console.error(error);
  }
};

const getStudySpaceDetailsAsync = async (placeid) => {
  const request = {
    fields: [
      `adr_address`, 
      `formatted_phone_number`,
      `name`,
      `photo`,
      `rating`,
      `type`,
      `url`,
      `website`,
    ],
    placeid,
  };

  try {
    const { json: { result }} = await googleMapsClient.place(request).asPromise();
    return createStudySpaceObjectAsync(result);
  } catch (error) {
    console.error(error);
  }
};

module.exports = getStudySpaceDetailsAsync;
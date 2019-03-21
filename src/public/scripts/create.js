const googleMapsClient = require('./client');

const getPhotoAsync = 
async ({ photo_reference, height, width }) => {

  const maxDimension = 1600;

  const request = {
    photoreference: photo_reference,
    maxwidth: width > maxDimension ? maxDimension : width,
    maxheight: height > maxDimension ? maxDimension : height,
  };

  return await googleMapsClient.placesPhoto(request).asPromise();  
};

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
  const capitalizedType = result.types[0].substring(0, 1).toUpperCase() + result.types[0].substring(1);
  
  const response = await getPhotoAsync(result.photos[0]);
  console.log(response);

  return {
    name: result.name,
    type: capitalizedType,
    address: addressObject[`street-address`],
    postalCode: addressObject[`postal-code`],
    city: addressObject[`locality`],
    province: addressObject[`region`],
    website: result.website,
    phone: result.formatted_phone_number,
    image: result.photos[0].photo_reference,
    rating: result.rating,
  };
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
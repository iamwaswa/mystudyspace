const googleMapsClient = require('./utils/client');
const defaults = require('./defaults');

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
  const photoUrl = `https://${response.req.socket._host}${response.req.path}`;

  return {
    name: result.name ? result.name : defaults[`name`],
    type: capitalizedType ? capitalizedType : defaults[`type`],
    address: addressObject[`street-address`] ? addressObject[`street-address`] : defaults[`address`],
    postalCode: addressObject[`postal-code`] ? addressObject[`postal-code`] : defaults[`postalCode`],
    city: addressObject[`locality`] ? addressObject[`locality`] : defaults[`city`],
    province: addressObject[`region`] ? addressObject[`region`] : defaults[`province`],
    website: result.website ? result.website : defaults[`website`],
    phone: result.formatted_phone_number ? result.formatted_phone_number : defaults[`phone`],
    image: photoUrl ? photoUrl : defaults[`image`],
    rating: result.rating ? result.rating : defaults[`rating`],
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
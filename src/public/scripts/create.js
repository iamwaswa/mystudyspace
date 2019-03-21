const handleResults = (results) => {
  console.log(results);
};

const getStudySpaceDetails = (placeId) => {
  const sessionToken = new google.maps.places.AutocompleteSessionToken();
  
  const request = {
    fields: [
      `address_components`, 
      `adr_address`, 
      `formatted_address`,
      `formatted_phone_number`,
      `name`,
      `photos`,
      `rating`,
      `types`,
      `url`,
      `website`,
    ],
    placeId,
    sessionToken,
  };

  const textSearchService = new google.maps.places.PlacesService(
    document.getElementsByClassName(`map-display`)[0]
  );

  textSearchService.getDetails(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      handleResults(results);
    } else {
      console.error(`The search failed with status: ${status}`);
    }
  });
  
  console.log(`This is the place id: ${placeId}`);
};

module.exports = getStudySpaceDetails;
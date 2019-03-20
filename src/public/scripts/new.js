const zoomLevel = 9;
const radiusSize = 100;
const content = {
  userPosition: ``,
  userMarker: ``,
  map: ``,
};

const querifyInput = (input) => {
  return input
    .split(``)
    .map((character) => {
      if (character === ` `) {
        return `+`;
      } else if (character === `,`) {
        return ``;
      } else {
        return character;
      }
    })
    .join(``);
};

const removeCountryAndPostFromAddress = (address) => {
  const addressArray = address.split(``);
  const countryStartIndex = addressArray.lastIndexOf(`,`);
  const addressWithoutCountry = addressArray.slice(0, countryStartIndex);
  const postalCodeStartIndex = addressWithoutCountry.lastIndexOf(`,`);
  return addressWithoutCountry.slice(0, postalCodeStartIndex);
};

const addLineBreaksToAddress = (address) => {
  return removeCountryAndPostFromAddress(address)
    .map((character) => {
      if (character === `,`) {
        return `</br>`;
      } else {
        return character;
      }
    })
    .join(``);
};

const initResultsDisplay = (results) => {
  results.forEach((result) => {
    const {
      formatted_address: address,
      geometry: position,
      icon: iconUrl,
      name,
      photos,
      rating
    } = result;

    const formattedAddress = addLineBreaksToAddress(address);

    const resultMarker = new google.maps.Marker({
      position: position.location,
      map: content.map,
      animation: google.maps.Animation.DROP,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(20, 20),
      }
    });

    const searchQuery = `/maps/search/${querifyInput(name)}+${querifyInput(address)}`;
    const formContent = `<a target='_blank' href='http://www.google.com${searchQuery}'>Add Studyspace</a>`;
    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${name}</strong></br></br>${formattedAddress}</br></br>${formContent}`,
    });

    resultMarker.addListener(`click`, () => {
      infoWindow.open(content.map, resultMarker);
      resultMarker.setAnimation(google.maps.Animation.BOUNCE);
    });

    infoWindow.addListener(`closeclick`, () => {
      resultMarker.setAnimation(null);
    });
  });
};

const initPlacesSearch = () => {
  const places = [`public library`, `coffee shop`];

  places.forEach((place) => {
    const request = {
      query: place,
      openNow: true,
      location: content.userPosition,
      radius: radiusSize,
    };

    const textSearchService = new google.maps.places.PlacesService(content.map);
    textSearchService.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        initResultsDisplay(results);
      } else {
        console.error(`The search failed with status: ${status}`);
      }
    });
  });
};

const initMyMarker = () => {
  content.userMarker = new google.maps.Marker({
    position: content.userPosition,
    map: content.map,
    animation: google.maps.Animation.DROP,
  });

  const myInfoWindow = new google.maps.InfoWindow({
    content: `This is your location`,
  });

  content.userMarker.addListener(`click`, () => {
    myInfoWindow.open(content.map, content.userMarker);
  });

  initPlacesSearch();
};

const initMap = () => {
  content.map = new google.maps.Map(document.getElementsByClassName(`map-display`)[0], {
    center: content.userPosition,
    zoom: zoomLevel,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  initMyMarker();
};

const assignMyPosition = (position) => {
  content.userPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  initMap();
};

const findMyLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(assignMyPosition);
  } else {
    console.error(`Your browser does not support geolcation.`);
  }
};

(() => findMyLocation())();
const zoomLevel = 12;
const radiusSize = 100;
const content = {
  userPosition: ``,
  userMarker: ``,
  map: ``,
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
    const { formatted_address, geometry, icon, name, place_id } = result;

    const formattedAddress = addLineBreaksToAddress(formatted_address);

    const resultMarker = new google.maps.Marker({
      position: geometry.location,
      map: content.map,
      animation: google.maps.Animation.DROP,
      icon: {
        url: icon,
        scaledSize: new google.maps.Size(20, 20),
      }
    });

    const formContent = `<form class='info-window' action='/studyspaces' method='POST'><input type='text' name='placeId' value='${place_id}'/><input type='submit' value='Add StudySpace'/></form>`
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

const latParagraph = document.getElementsByClassName(`lat`)[0];
const lngParagraph = document.getElementsByClassName(`lng`)[0];

const findMyLocation = () => {
  if (latParagraph && lngParagraph) {
    const lat = Number(latParagraph.textContent);
    const lng = Number(lngParagraph.textContent);
    const position = {
      coords: {
        latitude: lat,
        longitude: lng,
      },
    };
    assignMyPosition(position);
  } else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(assignMyPosition);
    } else {
      alert(`Your browser does not support geolcation. Consider updating your browser to the latest version or using a different browser`);
    }
  }
};

const spinner = document.getElementsByClassName(`spinner`)[0];
(() => {
  findMyLocation();
  window.onload = () => {
    spinner.style.animation = `fadeoutandhide 300ms ease-in 1 forwards normal`;
  };
})();
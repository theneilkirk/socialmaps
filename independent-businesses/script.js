import { iconRedPin, osmIcon, tileLayer } from "../icons/mapImagery.js";

// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 11); // Default to (0, 0) with zoom level 11

// Use OpenNVKarte
tileLayer.transportMap.addTo(map);

// Set the default location
var userLat = 51.56567;
var userLng = -0.14373;
var searchRange = 0.01;

var typesDropdown = document.getElementById('typeDropdown');
var elements = [];
var selectedType;

// Check if Geolocation is available in the browser
if ("geolocation" in navigator) {
  try {
    // Get the user's current location and center the map
    navigator.geolocation.getCurrentPosition(function (position) {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;
      map.setView([userLat, userLng], 15);

      // Add a marker at the user's location
      L.marker([userLat, userLng], {
        icon: iconRedPin
      }).addTo(map)
        .bindPopup('You are here');

      fetchData();
    });
  } catch (error) {
    console.error("Error accessing geolocation:", error);
  }
} else {
  console.error("Geolocation is not available in this browser.");
}

// Element variables
var elementTypes = new Set();

function fetchData() {
  console.log('Fetching data');
  var searchCoords = [userLat - searchRange, userLng - searchRange, userLat + searchRange, userLng + searchRange].join(',');
  var overpassUrl = 'https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(((nwr["shop"](' + searchCoords + ');nwr["amenity"="cafe"](' + searchCoords + ');nwr["amenity"="restaurant"](' + searchCoords + ');nwr["amenity"="fast_food"](' + searchCoords + ');nwr["amenity"="bar"](' + searchCoords + ');nwr["amenity"="ice_cream"](' + searchCoords + ');wr["amenity"="pub"](' + searchCoords + ');); - nwr["brand"](' + searchCoords + '););nwr["shop"="charity"](' + searchCoords + '););out body;>;out skel qt;';
  fetch(overpassUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var tagsToExclude = ['vacant', 'job_centre', 'e-cigarette'];
      data.elements.forEach(element => {
        // Extract the different element types
        for (const key in element.tags) {
          if ((key.startsWith('amenity') || key.startsWith('shop')) && !tagsToExclude.includes(element.tags[key])) {
            elementTypes.add(namifyTag(element.tags[key]));
            element.myType = namifyTag(element.tags[key]);
            element.osmIcon = element.tags[key];
            elements.push(element);
            if (!osmIcon[element.tags[key]])
              console.log ('Missing icon: ' + element.tags[key]);
          }
        }
      });

      // Convert Set to Array and sort alphabetically
      var uniqueElementTypes = Array.from(elementTypes);
      uniqueElementTypes.sort();

      // Populate the dropdown menu with the types
      uniqueElementTypes.forEach(type => {
        var option = document.createElement('option');
        option.value = type;
        option.textContent = namifyTag(type);
        typesDropdown.appendChild(option);
      });
      typesDropdown.value = uniqueElementTypes[0];
      selectedType = uniqueElementTypes[0];
      displayData();
    });
}

// Add event listener to filter elements based on selected  type
typesDropdown.addEventListener('change', function () {
  selectedType = this.value;
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
  displayData();
});

function displayData() {
  console.log('displaying data (selected type: ' + selectedType + ')');
  elements.forEach(element => {
    var thisIcon = {};
    var marker;
    var popupText = '';

    //console.log(element.myType + ' = ' + selectedType);

    // Build shop info from tags
    if (element.tags && element.myType == selectedType) {
      console.log (element);
      // Set information about the element for display
      thisIcon.type = element.osmIcon;
      if (element.tags.shop) {
        thisIcon.name = element.tags.name ? namifyTag(element.tags.name) : namifyTag(element.tags.shop);
      } else if (element.tags.amenity) {
        thisIcon.name = element.tags.name ? namifyTag(element.tags.name) : namifyTag(element.tags.amenity);
      } else {
        thisIcon.name = element.tags.name ? namifyTag(element.tags.name) : 'Name unknown';
      }

      popupText += '<p><strong>' + thisIcon.name + '</strong></p><p>';
      popupText += element.tags.opening_hours ? element.tags.opening_hours : '';
      popupText += '</p><p>';
      popupText += element.tags['contact:phone'] ? '<a href="tel:' + element.tags['contact:phone'] + '">' + element.tags['contact:phone'] + '</a>' : '';
      popupText += '</p>';
      popupText += element.tags['addr:housenumber'] ? element.tags['addr:housenumber'] + ' ' : '';
      popupText += element.tags['addr:street'] ? element.tags['addr:street'] + '</br>' : '';
      popupText += element.tags['addr:city'] ? element.tags['addr:city'] + '</br>' : '';
      popupText += element.tags['addr:postcode'] ? element.tags['addr:postcode'] + '</br>' : '';
      popupText += '</p>';

      var coordinates;
      if (element.type === 'node') {
        coordinates = [element.lat, element.lon];
      } else if (element.type === 'way') {
        var coordSet = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
        coordinates = findMiddle(coordSet);
        L.polyline(coordSet, { color: 'green', fill: 'lightgreen' }).addTo(map);
      }

      if (osmIcon[element.tags.amenity])
        marker = L.marker(coordinates, { icon: osmIcon[element.osmIcon] }).addTo(map);
      else if (osmIcon[element.tags.shop])
        marker = L.marker(coordinates, { icon: osmIcon[element.osmIcon] }).addTo(map);
      else {
        marker = L.marker(coordinates).addTo(map);
      }

      if (marker)
        marker.bindPopup(popupText);
    }
  });
}

// Function to format OSM tags into readable name
function namifyTag(type) {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Roughly find the middle of a set of coordinates
function findMiddle(coordinates) {
  if (coordinates.length === 0)
    return null;
  let totalLat = 0;
  let totalLng = 0;
  for (const coordinate of coordinates) {
    totalLat += coordinate[0];
    totalLng += coordinate[1];
  }
  const middleLat = totalLat / coordinates.length;
  const middleLng = totalLng / coordinates.length;
  return [middleLat, middleLng];
}
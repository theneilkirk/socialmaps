// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 15); // Default to (0, 0) with zoom level 11

// Add a tile layer to the map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var userLat = 51.279;
var userLng = 1.0763;
var iconRedPin = L.icon({
  iconUrl: 'pin-marker-red.png',
  iconSize:     [29, 50], // size of the icon
  iconAnchor:   [15, 50], // point of the icon which will correspond to marker's location
  popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
});

// Check if Geolocation is available in the browser
if ("geolocation" in navigator) {
  try {
    // Get the user's current location and center the map
    navigator.geolocation.getCurrentPosition(function(position) {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;
      map.setView([userLat, userLng], 11);
      console.log("User: " + userLat + "," + userLng);

      // Add a marker at the user's location (optional)
      L.marker([userLat, userLng], {icon: iconRedPin}).addTo(map)
        .bindPopup('Your Location');
    });
  } catch (error) {
    console.error("Error accessing geolocation:", error);
  }
} else {
  console.error("Geolocation is not available in this browser.");
}

var swLat = userLat - 0.25;
var swLng = userLng - 0.25;
var neLat = userLat + 0.25;
var neLng = userLng + 0.25;

var recyclingTypes = new Set(); // Use a Set to automatically remove duplicates
var recyclingTypesDropdown = document.getElementById('recyclingTypesDropdown');
var defaultRecyclingType = "tetrapak"; // Default selected recycling type

// Make the HTTP request to Overpass API
console.log('Fetching data from overpass');
var overpassUrl = 'https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(nwr["amenity"="recycling"](' + swLat + ',' + swLng + ',' + neLat + ',' + neLng + '););out body;>;out skel qt;';
var recycling_stations;

fetch(overpassUrl)
  .then(response => response.json())
  .then(data => {
    // Loop through the elements and add them to the map
    data.elements.forEach(element => {
      if (element.type === 'node') {
        L.marker([element.lat, element.lon]);
      } else if (element.type === 'way') {
        var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);

        // Add marker only on the first node of the way
        if (coordinates.length > 0) {
          L.marker(coordinates[0]);
        }
        L.polyline(coordinates);
      }

      // Extract and store recycling types from tags
      for (const key in element.tags) {
        if (key.startsWith('recycling:') && element.tags[key] === 'yes') {
          const recyclingType = key.split(':')[1];
          recyclingTypes.add(recyclingType);
        }
      }
    });

    // Function to format recycling type
    function formatRecyclingType(type) {
      return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    // Convert Set to Array and sort alphabetically
    var uniqueRecyclingTypes = Array.from(recyclingTypes);
    uniqueRecyclingTypes.sort(); // Sort alphabetically

    // Populate the dropdown menu with sorted recycling types
    uniqueRecyclingTypes.forEach(type => {
      var option = document.createElement('option');
      option.value = type;
      option.textContent = formatRecyclingType(type);
      recyclingTypesDropdown.appendChild(option);
    });
    
    
    // Add event listener to filter elements based on selected recycling type
    recyclingTypesDropdown.addEventListener('change', function () {
      var selectedType = this.value;
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });

      // Add a marker at the user's location (optional)
      L.marker([userLat, userLng], {icon: iconRedPin}).addTo(map)
        .bindPopup('Your Location');
      
      var iconRecycling = L.icon({
        iconUrl: 'recycling.png',
        iconSize:     [40, 40], // size of the icon
        iconAnchor:   [15, 50], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
      });
      var iconRecyclingBin = L.icon({
        iconUrl: 'recycling-bin.png',
        iconSize:     [29, 30], // size of the icon
        iconAnchor:   [15, 50], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
      });

      data.elements.forEach(element => {
        var recyclingStation = {};
        var icon = {icon: iconRecyclingBin};
        var showMarker = false;
        var marker;
        var popupText = '';
        if (element.tags && element.tags.name)
          popupText += '<h3>'+element.tags.name+'</h3>';
        else
          popupText += '<h3>Recycling Container</h3>'
        popupText += '<h4>Accepted recycling</h4>';
        
        for (const key in element.tags) {
          if (key.startsWith('recycling:') && element.tags[key] === 'yes') {
            const recyclingType = key.split(':')[1];
            popupText += recyclingType+', ';
          }
          if (key == 'recycling_type' && element.tags[key] == 'centre') {
            icon = {icon: iconRecycling};
          } else if (element.tags[key] == 'container') {
            icon = {icon: iconRecyclingBin};
          }
        
          if (selectedType === '' || recyclingType === selectedType) {
            showMarker = true;
          }
        }
        popupText += '</p>';
        
        if (showMarker) {
          if (element.type === 'node') {
            marker = L.marker([element.lat, element.lon], icon).addTo(map);
          } else if (element.type === 'way') {
            var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
            marker = L.marker(coordinates[0], icon).addTo(map);
            L.polyline(coordinates).addTo(map);
          }
          marker.bindPopup(popupText);
        }
      });
    });

    // Programmatically trigger the 'change' event on recyclingTypesDropdown
    var event = new Event('change');
    recyclingTypesDropdown.dispatchEvent(event);

  })
  .catch(error => console.error('Error fetching Overpass data:', error));
console.log(recyclingTypes);

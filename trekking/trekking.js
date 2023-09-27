// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 11); // Default to (0, 0) with zoom level 11

// Add a tile layer to the map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var userLat = 51.279;
var userLng = 1.0763;
var iconRedPin = L.icon({
  iconUrl: 'pin-marker-red.png',
  iconSize: [29, 50], // size of the icon
  iconAnchor: [15, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
});

// Check if Geolocation is available in the browser
if ("geolocation" in navigator) {
  try {
    // Get the user's current location and center the map
    navigator.geolocation.getCurrentPosition(function(position) {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;
      map.setView([userLat, userLng], 16);
    });
  } catch (error) {
    console.error("Error accessing geolocation:", error);
  }
} else {
  console.error("Geolocation is not available in this browser.");
}

var swLat = userLat - 0.01;
var swLng = userLng - 0.01;
var neLat = userLat + 0.01;
var neLng = userLng + 0.01;

var amenityTypes = new Set(); // Use a Set to automatically remove duplicates
var amenitiesDropdown = document.getElementById('amenitiesDropdown');
var trekkingAmenities = ['drinking_water','first_aid','information','library','pharmacy','phone','shelter','taxi','telephone','toilets','water_point'];

// Make the HTTP request to Overpass API
console.log('Fetching data from overpass');
var overpassUrl = 'https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(nwr["amenity"](' + swLat + ',' + swLng + ',' + neLat + ',' + neLng + '););out body;>;out skel qt;';
var amenities;

fetch(overpassUrl)
  .then(response => response.json())
  .then(data => {
    console.log (data);
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
        if (key.startsWith('amenity') && trekkingAmenities.includes(element.tags[key])) {
          amenityTypes.add(element.tags[key]);
        }
      }
    });

    // Function to format recycling type
    function formatAmenityType(type) {
      return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    // Convert Set to Array and sort alphabetically
    var uniqueAmenityTypes = Array.from(amenityTypes);
    uniqueAmenityTypes.sort(); // Sort alphabetically

    // Populate the dropdown menu with sorted recycling types
    uniqueAmenityTypes.forEach(type => {
      var option = document.createElement('option');
      option.value = type;
      option.textContent = formatAmenityType(type);
      amenitiesDropdown.appendChild(option);
    });


    // Add event listener to filter elements based on selected recycling type
    amenitiesDropdown.addEventListener('change', function() {
      var selectedType = this.value;
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          map.removeLayer(layer);
        }
      });
      
      var iconRedDot = L.icon({
        iconUrl: 'red-circle.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [10, -10] // point from which the popup should open relative to the iconAnchor
      });
      var icons = {
        drinking_water : L.icon({iconUrl: 'drinking_water.png',iconSize: [20, 20],iconAnchor: [10, 10],popupAnchor: [10, -10]}),
        pharmacy : L.icon({iconUrl: 'pharmacy.png',iconSize: [20, 20],iconAnchor: [10, 10],popupAnchor: [10, -10]}),
        telephone : L.icon({iconUrl: 'telephone.png',iconSize: [20, 20],iconAnchor: [10, 10],popupAnchor: [10, -10]}),
        toilets : L.icon({iconUrl: 'toilets.png',iconSize: [20, 20],iconAnchor: [10, 10],popupAnchor: [10, -10]})
      };

      data.elements.forEach(element => {
        var amenity = {};
        var icon;
        var showMarker = false;
        var marker;
        var popupText = '';
        
        if (element.tags && element.tags.amenity && trekkingAmenities.includes(element.tags.amenity)) {
          showMarker = true;
          //console.log (element.tags);
          popupText += '<p><strong>' + element.tags.amenity + '</strong></p>';
          popupText += element.tags.name ? '<p>' + element.tags.name + '</p>' : '';
        }

        if (showMarker) {
          if (element.type === 'node') {
            if (icons[element.tags.amenity])
              marker = L.marker([element.lat, element.lon], {icon: icons[element.tags.amenity]}).addTo(map);
            else {
              marker = L.marker([element.lat, element.lon]).addTo(map);
              console.log ("Missing icon: " + element.tags.amenity);
            }
          } else if (element.type === 'way') {
            var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
            marker = L.marker(coordinates[0], iconRedDot).addTo(map);
            L.polyline(coordinates).addTo(map);
          }
          marker.bindPopup(popupText);
        }

        // Add a marker at the user's location
        L.marker([userLat, userLng], {
            icon: iconRedPin
          }).addTo(map)
          .bindPopup('Your Location');
      });
    });

    // Programmatically trigger the 'change' event on amenitiesDropdown
    var event = new Event('change');
    amenitiesDropdown.dispatchEvent(event);

  })
  .catch(error => console.error('Error:', error));

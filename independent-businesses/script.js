// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 11); // Default to (0, 0) with zoom level 11

// Add a tile layer to the map (e.g., OpenStreetMap)
/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/

L.tileLayer('https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var userLat = 51.279;
var userLng = 1.0763;

// Check if Geolocation is available in the browser
if ("geolocation" in navigator) {
  try {
    // Get the user's current location and center the map
    navigator.geolocation.getCurrentPosition(function(position) {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;
      map.setView([userLat, userLng], 16);
      displayMap();
      var event = new Event('change');
      elementsDropdown.dispatchEvent(event);
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

var elementTypes = new Set(); // Use a Set to automatically remove duplicates
var elementsDropdown = document.getElementById('amenitiesDropdown');

const icon = {
  size: [30, 30],
  anchor: [15, 15],
  popupAnchor: [15, -15]
};
var iconRedPin = L.icon({
  iconUrl: 'pin-marker-red.png',
  iconSize: [29, 50], // size of the icon
  iconAnchor: [15, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
});
var iconRedDot = L.icon({
  iconUrl: 'red-circle.png',
  iconSize: [20, 20], // size of the icon
  iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
  popupAnchor: [10, -10] // point from which the popup should open relative to the iconAnchor
});
var icons = {
  art : L.icon({iconUrl: 'art.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  bakery : L.icon({iconUrl: 'bakery.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  bar : L.icon({iconUrl: 'bar.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  beauty : L.icon({iconUrl: 'beauty.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  bicycle : L.icon({iconUrl: 'bicycle.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  books : L.icon({iconUrl: 'books.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  butcher : L.icon({iconUrl: 'butcher.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  coffee : L.icon({iconUrl: 'cafe.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  computer : L.icon({iconUrl: 'computer.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  convenience : L.icon({iconUrl: 'convenience.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  cafe : L.icon({iconUrl: 'cafe.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  charity : L.icon({iconUrl: 'charity.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  carpet : L.icon({iconUrl: 'carpet.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  cheese : L.icon({iconUrl: 'cheese.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  clothes : L.icon({iconUrl: 'clothes.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  confectionery : L.icon({iconUrl: 'candy.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  copyshop : L.icon({iconUrl: 'copyshop.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  craft : L.icon({iconUrl: 'art.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  curtain : L.icon({iconUrl: 'curtain.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  dry_cleaning : L.icon({iconUrl: 'dry_cleaning.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  electronics : L.icon({iconUrl: 'electronics.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  estate_agent : L.icon({iconUrl: 'estate_agent.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  ethnic_crafts : L.icon({iconUrl: 'gift.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  fast_food : L.icon({iconUrl: 'fast_food.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  flooring : L.icon({iconUrl: 'flooring.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  florist : L.icon({iconUrl: 'florist.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  food : L.icon({iconUrl: 'food.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  frame : L.icon({iconUrl: 'frame.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  funeral_directors : L.icon({iconUrl: 'funeral_directors.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  furniture : L.icon({iconUrl: 'furniture.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  gift : L.icon({iconUrl: 'gift.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  greengrocer : L.icon({iconUrl: 'food.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  hairdresser : L.icon({iconUrl: 'hairdresser.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  interior_decoration : L.icon({iconUrl: 'interior_decoration.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  jewelry : L.icon({iconUrl: 'jewelry.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  kitchen : L.icon({iconUrl: 'kitchen.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  mobile_phone : L.icon({iconUrl: 'mobile_phone.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  music : L.icon({iconUrl: 'music.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  optician : L.icon({iconUrl: 'optician.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  pub : L.icon({iconUrl: 'pub.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  repair : L.icon({iconUrl: 'repair.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  restaurant : L.icon({iconUrl: 'restaurant.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  shoes : L.icon({iconUrl: 'shoes.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  stationery : L.icon({iconUrl: 'stationery.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  tattoo : L.icon({iconUrl: 'tattoo.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  tobacco : L.icon({iconUrl: 'tobacco.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  toys : L.icon({iconUrl: 'toys.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor}),
  travel_agency : L.icon({iconUrl: 'sunbed.png',iconSize: icon.size, iconAnchor: icon.anchor, popupAnchor: icon.popupAnchor})
};

document.getElementById("reloadButton").addEventListener("click", function (event) {
  console.log(lat + ' - ' + lng);
  return false;
});

function displayMap() {
  // Make the HTTP request to Overpass API
  console.log('Fetching data from overpass');
  var coords = swLat+','+swLng+','+neLat+','+neLng;
  var overpassUrl = 'https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(((nwr["shop"]('+coords+');nwr["amenity"="cafe"]('+coords+');nwr["amenity"="restaurant"]('+coords+');nwr["amenity"="fast_food"]('+coords+');nwr["amenity"="bar"]('+coords+');nwr["amenity"="ice_cream"]('+coords+');wr["amenity"="pub"]('+coords+');); - nwr["brand"]('+coords+'););nwr["shop"="charity"]('+coords+'););out body;>;out skel qt;';
  
  var elementsExclude = ['vacant','job_centre','e-cigarette'];
  
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
  
        // Extract and store types
        for (const key in element.tags) {
          if (key.startsWith('amenity') || key.startsWith('shop')) {
            elementTypes.add(element.tags[key]);
          }
        }
      });
  
      // Function to format recycling type
      function namifyTag(type) {
        return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    
      // Convert Set to Array and sort alphabetically
      var uniqueElementTypes = Array.from(elementTypes);
      uniqueElementTypes.sort(); // Sort alphabetically
    
      // Populate the dropdown menu with sorted recycling types
      uniqueElementTypes.forEach(type => {
        if (!elementsExclude.includes(type)) {
          var option = document.createElement('option');
          option.value = type;
          option.textContent = namifyTag(type);
          elementsDropdown.appendChild(option);
        }
      });

      // Add event listener to filter elements based on selected recycling type
      elementsDropdown.addEventListener('change', function() {
        var selectedType = this.value;
        map.eachLayer(function(layer) {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        data.elements.forEach(element => {
          var thisIcon = {};
          var showMarker = false;
          var marker;
          var popupText = '';
          
          if (element.tags) {
            // Set information about the element for display
            if (element.tags.shop) {
              thisIcon.name = element.tags.name ? namifyTag(element.tags.name) : namifyTag(element.tags.shop);
              thisIcon.type = element.tags.shop;
            } else if (element.tags.amenity) {
              thisIcon.name = element.tags.name ? namifyTag(element.tags.name) : namifyTag(element.tags.amenity);
              thisIcon.type = element.tags.amenity;
            } else {
              thisIcon.name = element.tags.name ? namifyTag(element.tags.name) : 'Name unknown';
            }
            
            // If the user has selected a shop type, only display that type
            if (elementsDropdown.selectedIndex > 0) {
              if (thisIcon.type === selectedType) {
                showMarker = true;
              }
            } else {
              showMarker = true;
            }
            
            // Don't show any shops on the exclude list
            if (elementsExclude.includes(thisIcon.type)) {
              showMarker = false;
            }
            
            popupText += '<p><strong>' + thisIcon.name + '</strong></p><p>';
            popupText += element.tags.opening_hours ? element.tags.opening_hours : '';
            popupText += '</p><p>';
            popupText += element.tags['contact:phone'] ? '<a href="tel:'+element.tags['contact:phone']+'">'+element.tags['contact:phone']+'</a>' : '';
            popupText += '</p>';
            popupText += element.tags['addr:housenumber'] ? element.tags['addr:housenumber']+' ' : '';
            popupText += element.tags['addr:street'] ? element.tags['addr:street']+'</br>' : '';
            popupText += element.tags['addr:city'] ? element.tags['addr:city']+'</br>' : '';
            popupText += element.tags['addr:postcode'] ? element.tags['addr:postcode']+'</br>' : '';
            popupText += '</p>';
          }
  
          if (showMarker) {
            var coordinates;
            if (element.type === 'node') {
              coordinates = [element.lat, element.lon];
            } else if (element.type === 'way') {
              var coordSet = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
              coordinates = findMiddle(coordSet);
              L.polyline(coordSet, {color: 'green', fill: 'lightgreen'}).addTo(map);
            }
            
            if (icons[element.tags.amenity])
              marker = L.marker(coordinates, {icon: icons[element.tags.amenity]}).addTo(map);
            else if (icons[element.tags.shop])
              marker = L.marker(coordinates, {icon: icons[element.tags.shop]}).addTo(map);
            else {
              L.marker(coordinates).addTo(map);
              console.log ('Missing icon: ' + (element.tags.shop ? element.tags.shop : element.tags.amenity));
            }
            
            if (marker)
              marker.bindPopup(popupText);
          }
  
          // Add a marker at the user's location
          L.marker([userLat, userLng], {
              icon: iconRedPin
            }).addTo(map)
            .bindPopup('Your Location');
        });
      });
      
      // Set a default selected type
      elementsDropdown.selectedIndex = uniqueElementTypes.indexOf('charity');
  
      // Programmatically trigger the 'change' event on amenitiesDropdown
      var event = new Event('change');
      elementsDropdown.dispatchEvent(event);
      
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
  
    })
    .catch(error => console.error('Error:', error));
}

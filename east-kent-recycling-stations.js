/*
  var map = L.map('map').setView([51.2097, 1.1687], 11);

  // Adding a base map layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
*/
  
/*
var map = L.map('map').setView([51.2097, 1.1687], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Make the HTTP request to Overpass API
var overpassUrl = 'http://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(nwr["amenity"="recycling"](51.0345,0.8212,51.4198,1.4845););out body;>;out skel qt;';

fetch(overpassUrl)
  .then(response => response.json())
  .then(data => {
    // Loop through the elements and add them to the map
    data.elements.forEach(element => {
      if (element.type === 'node') {
        L.marker([element.lat, element.lon]).addTo(map);
      } else if (element.type === 'way') {
        var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
        L.polyline(coordinates).addTo(map);
      }
    });
  })
  .catch(error => console.error('Error fetching Overpass data:', error));
*/

/*
var map = L.map('map').setView([51.2097, 1.1687], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var recyclingTypes = new Set(); // Use a Set to automatically remove duplicates

// Make the HTTP request to Overpass API
var overpassUrl = 'http://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(nwr["amenity"="recycling"](51.0345,0.8212,51.4198,1.4845););out body;>;out skel qt;';

fetch(overpassUrl)
  .then(response => response.json())
  .then(data => {
    // Loop through the elements and add them to the map
    data.elements.forEach(element => {
      if (element.type === 'node') {
        L.marker([element.lat, element.lon]).addTo(map);
      } else if (element.type === 'way') {
        var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
        L.polyline(coordinates).addTo(map);
      }

      // Extract and store recycling types from tags
      for (const key in element.tags) {
        if (key.startsWith('recycling:') && element.tags[key] === 'yes') {
          const recyclingType = key.split(':')[1];
          recyclingTypes.add(recyclingType);
        }
      }
    });

    console.log(Array.from(recyclingTypes)); // Convert Set to Array and print the unique recycling types
  })
  .catch(error => console.error('Error fetching Overpass data:', error));
*/

/*
var map = L.map('map').setView([51.2097, 1.1687], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var recyclingTypes = new Set(); // Use a Set to automatically remove duplicates

// Make the HTTP request to Overpass API
var overpassUrl = 'https://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(nwr["amenity"="recycling"](51.0345,0.8212,51.4198,1.4845););out body;>;out skel qt;';

fetch(overpassUrl)
  .then(response => response.json())
  .then(data => {
    // Loop through the elements and add them to the map
    data.elements.forEach(element => {
      if (element.type === 'node') {
        L.marker([element.lat, element.lon]).addTo(map);
      } else if (element.type === 'way') {
        var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);

        // Add marker only on the first node of the way
        if (coordinates.length > 0) {
          L.marker(coordinates[0]).addTo(map);
        }

        L.polyline(coordinates).addTo(map);
      }

      // Extract and store recycling types from tags
      for (const key in element.tags) {
        if (key.startsWith('recycling:') && element.tags[key] === 'yes') {
          const recyclingType = key.split(':')[1];
          recyclingTypes.add(recyclingType);
        }
      }
    });

    console.log(Array.from(recyclingTypes)); // Convert Set to Array and print the unique recycling types
  })
  .catch(error => console.error('Error fetching Overpass data:', error));
*/


var map = L.map('map').setView([51.2097, 1.1687], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var recyclingTypes = new Set(); // Use a Set to automatically remove duplicates

var recyclingTypesDropdown = document.getElementById('recyclingTypesDropdown');

var defaultRecyclingType = "tetrapak"; // Default selected recycling type

// Make the HTTP request to Overpass API
var overpassUrl = 'http://www.overpass-api.de/api/interpreter?data=[out:json][timeout:25];(nwr["amenity"="recycling"](51.0345,0.8212,51.4198,1.4845););out body;>;out skel qt;';

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

      data.elements.forEach(element => {
        for (const key in element.tags) {
          var marker;
          var popupText = element.tags.name ? "<p><strong>"+element.tags.name+"</strong></p>" : "<p><strong>Recycling station</strong></p>";
          // popupText += "<p>Accepted recycling</p><ul>";
          if (key.startsWith('recycling:') && element.tags[key] === 'yes') {
            const recyclingType = key.split(':')[1];
            if (selectedType === '' || recyclingType === selectedType) {
              if (element.type === 'node') {
                marker = L.marker([element.lat, element.lon]).addTo(map);
              } else if (element.type === 'way') {
                var coordinates = element.nodes.map(nodeId => [data.elements.find(node => node.id === nodeId).lat, data.elements.find(node => node.id === nodeId).lon]);
                marker = L.marker(coordinates[0]).addTo(map);
                L.polyline(coordinates).addTo(map);
              }
              /*
              This code only displays the selected recycling type; more needs to be done to show ALL the recycling types for a clicked on recycling station
              
              if (key.startsWith('recycling:') && element.tags[key] === 'yes') {
                const recyclingType = key.split(':')[1];
                popupText += "<li>"+formatRecyclingType(recyclingType)+"</li>";
              }
              popupText += "</ul>";
              */
              marker.bindPopup(popupText);
            }
          }
        }
      });
    });
    
    // Set default selected recycling type
    recyclingTypesDropdown.value = defaultRecyclingType;

    // Programmatically trigger the 'change' event on recyclingTypesDropdown
    var event = new Event('change');
    recyclingTypesDropdown.dispatchEvent(event);

  })
  .catch(error => console.error('Error fetching Overpass data:', error));


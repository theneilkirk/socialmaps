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


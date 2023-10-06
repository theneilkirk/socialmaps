// Initialize the Leaflet map
var map = L.map('map').setView([0, 0], 11); // Default to (0, 0) with zoom level 11

// Add a tile layer to the map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Check if Geolocation is available in the browser
if ("geolocation" in navigator) {
    try {
        // Get the user's current location and center the map
        navigator.geolocation.getCurrentPosition(function(position) {
            var userLat = position.coords.latitude;
            var userLng = position.coords.longitude;
            map.setView([userLat, userLng], 11);
            console.log("User: "+userLat+","+userLng);
            
            // Add a marker at the user's location (optional)
            L.marker([userLat, userLng]).addTo(map)
                .bindPopup('Your Location')
                .openPopup();
        });
    } catch (error) {
        console.error("Error accessing geolocation:", error);
    }
} else {
    console.error("Geolocation is not available in this browser.");
}


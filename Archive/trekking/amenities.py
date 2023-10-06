import requests

# Define the Overpass API URL
url = "https://www.overpass-api.de/api/interpreter"
data = {
    "data": '[out:json][timeout:25];(nwr["amenity"](50.7994,0.3639,51.5327,1.615););out body;>;out skel qt;'
}

# Make the HTTP request
response = requests.post(url, data=data)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()
    
    # Extract the amenity values from the elements
    amenities = set()  # Use a set to automatically remove duplicates
    for element in data["elements"]:
        if "tags" in element and "amenity" in element["tags"]:
            amenities.add(element["tags"]["amenity"])

    # Convert the set to a sorted list
    sorted_amenities = sorted(list(amenities))
    
    # Print the sorted amenities
    for amenity in sorted_amenities:
        print(amenity)
else:
    print("HTTP request failed with status code:", response.status_code)

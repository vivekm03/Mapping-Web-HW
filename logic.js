// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Create our map, giving it the streetmap and earthquakes layers to display on load
 var myMap = L.map("map", {
  center: [
    46.06, -114.34
  ],
  zoom: 4,
  layers: [streetmap]
});

// Layer Groups
var earthquakes = new L.layerGroup();

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
      //Define color scale
      function colorScale(mag){
        switch(true){
          case mag < 1:
            return "#72FF81";
          case mag < 2:
            return "#C8FF72";
          case mag < 3:
            return "#F0FF72";
          case mag < 4:
            return "#FFD672";
          case mag < 5:
            return "#FE3B10";
          default:
            return "#E02800";
      }};

      function styleIt(feature) {
        return {
                stroke: false,
                fillOpacity: .7,
                fillColor: colorScale(feature.properties.mag),
                radius: feature.properties.mag*5    
          }};

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
      L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleIt,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
          "<p>" + "Magnitude:" + feature.properties.mag + "</p>");
      }
}).addTo(earthquakes);
earthquakes.addTo(myMap);

});

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Legend
var legend = L.control({position: 'bottomright'});


function colorScale(d) {
    return d <= 1 ? "#72FF81":
           d <= 2 ? "#C8FF72":
           d <= 3 ? "#F0FF72":
           d <= 4 ? "#FFD672":
           d <= 5 ? "#FF8B72":
           d > 5 ? "#FE3B10":
                    "#ffffff";
  }


  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorScale(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap)
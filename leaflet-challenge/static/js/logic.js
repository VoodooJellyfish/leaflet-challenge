// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    var depths = [];
    var earthquakes = [];

    for (var index = 0; index < earthquakeData.length; index ++) {
        var earthquake = earthquakeData[index];
        var earthquake_depth = earthquake.geometry.coordinates[3];
        var color = "";
        if (earthquake.geometry.coordinates[2] >= 100){
            color = "#800026";
        }
        else if (earthquake.geometry.coordinates[2] >= 75){
            color = "#BD0026";
        }
        else if (earthquake.geometry.coordinates[2] >= 50){
            color = '#E31A1C';
        }
        else if (earthquake.geometry.coordinates[2] >= 25){
            color = '#FC4E2A';
        }
        else {
            color = '#FD8D3C';
        }
        var circle_markers = L.circle([
            earthquake.geometry.coordinates[1], 
            earthquake.geometry.coordinates[0]],{
            color: color,
            fillColor: color,
            fillOpacity: 0.75,
            radius: earthquake.properties.mag * 25000,
            })
            .bindPopup("<h3>" + earthquake.properties.place +
            "</h3><hr><p>" + new Date(earthquake.properties.time) + "</p>")
        earthquakes.push(circle_markers)
        depths.push(earthquake_depth)
        };
    createMap(new L.LayerGroup(earthquakes));
};

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });  

function getColor(d) {
    return d > 100 ? '#800026' :
           d > 75  ? '#BD0026' :
           d > 50  ? '#E31A1C' :
           d > 25 ? '#FC4E2A' :
                     '#FD8D3C' ;
    }

    
var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        labels = ['<strong>Categories</strong>'],
        categories = [0,25,50,75,100];
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));
        }
        div.innerHTML = labels.join('<br>');
        return div;
         };
    
    legend.addTo(myMap);
}

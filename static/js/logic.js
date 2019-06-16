// Creating map object
var myMap = L.map("map-id", {
  center: [46.8083, -100.7837], //Bismarck
  zoom: 4
});


// Adding light map tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 16,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query website
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(URL, earthquakes);

function earthquakes(quakes){
  quakes = quakes.features  //get down to relevant data

   for (var i = 0; i < quakes.length; i++) {

      var lat1 = quakes[i].geometry.coordinates[1]
      var long1 = quakes[i].geometry.coordinates[0]
      var loc = [lat1, long1]

      //call function to get color based on earthquake magnitude
      var magnitude = parseFloat(quakes[i].properties.mag)
      var quakecolor = getQuakeColor(magnitude)

      //circlemarkers, size based on magnitude
      L.circleMarker(loc, {
        fillOpacity: 0.9,
        stroke: false,
        fillColor: quakecolor,
        radius: magnitude * 2.5
      }).bindPopup("<h3>" + quakes[i].properties.place + "</h3>").addTo(myMap)
    };
};


//Funtion for COLOR BASED ON MAGNITUDE SIZE
function getQuakeColor(magnitude){
  
  if (magnitude < 1) {
    return "#fff246";
  }
  else if (magnitude < 2) {
    return "#a3d76e";
  }
  else if (magnitude < 3) {
    return "#00b7a3";
  }
  else if (magnitude < 4) {
    return "#32bbff";
  }
  else if (magnitude < 5) {
    return "#4e5ecf";
  }
  else {
    return "#b714e0";
  }
};

// CREATE LEGEND
var legend = L.control({position: 'bottomright'});
            legend.onAdd=function(map){
                var div=L.DomUtil.create('div','legend');
                var labels=["<1 ","1-2","2-3","3-4", "4-5", ">5" ];
                var mag = [0.9, 1.9, 2.9, 3.9, 4.9, 5.1];
                div.innerHTML='<div><b>Legend: Magnitude</b></div';
                for(var i=0; i <mag.length; i++){
                    div.innerHTML+='<i style="background:'+getQuakeColor(mag[i])+' ">&nbsp;</i>&nbsp;&nbsp;'
                    +labels[i]+'<br/>';
                }
                return div;
            }
legend.addTo(myMap);
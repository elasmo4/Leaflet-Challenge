let myMap = L.map("map", {
    center: [37.09, -105.71],
    zoom: 5
  });
  
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
  
// URL to USGS GeoJSON
const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function magSize(magnitude) {
    return magnitude * 17000
};

function depthColor(depth) {
    // Color scale to represent the depth of earthquakes
        if (depth < 10)
            {return "limegreen"}

        else if (depth < 30)
            {return "greenyellow"}
            
        else if (depth < 50)
            {return "yellow"}

        else if (depth < 70)
            {return "orange"}

        else if (depth < 90)
            {return "orangered"}

        else
            {return"#FF0000"}};

// Utilizing for loops to retrieve data from link
  d3.json(link).then(data => {

    let n = data.features.length
    for (let i = 0; i < n; i++) {

        let axes = (data.features[i].geometry.coordinates)
        let position = ([axes[1], axes[0]])
        let magnitude = (data.features[i].properties.mag)
        let depth = (axes[2])
        let place = data.features[i].properties.place
    
        // Earthquake markers
        L.circle(position, {
            fillOpacity: 0.75,
            color: "",
            fillColor: depthColor(depth),
            radius: magSize(magnitude)
            }).bindPopup(`<h2>${place}</h2> <hr> <p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p></h3>`).addTo(myMap)}});

    let legend = L.control({position: "bottomleft"});

    legend.onAdd = function(myMap) {
        let div = L.DomUtil.create("div", "legend"),
        labels = [-10, 10, 30, 50, 70, 90]

        div.innerHTML += "<h3 style='text-align: center'>Depth of<br>Earthquake</h3>"

        for (let i = 0; i < 5; i++) {
            div.innerHTML += '<i style="background:' + depthColor(labels[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px;"></i> ' + labels[i] + (labels[i + 1] ? '–' + labels[i + 1] + '<br>' : '+')};
        return div
    };
    legend.addTo(myMap);
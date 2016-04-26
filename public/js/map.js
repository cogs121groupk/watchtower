L.mapbox.accessToken = 'pk.eyJ1IjoiYmVlcnllMjgiLCJhIjoiY2lob2owdHFuMHVlcXRjbHppYjk3bnVtMyJ9.c9O7alSJC22CPlwNuiWOOw';
var map = L.mapbox.map('map', 'mapbox.streets');
var myLayer = L.mapbox.featureLayer().addTo(map);
var myLayer0 = L.mapbox.featureLayer();
var features = [];

var activeLayer = myLayer;

var features = [];

var features0 = [];

//loop through the DELPHI data, pushing feature objects into the array
for (var x = -120; x < 120; x += 20) {
    for (var y = -80; y < 80; y += 10) {
        features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [x, y]
            },
            properties: {
                'marker-color': '#000',
                'marker-symbol': 'star-stroked',
                title: [x, y].join(',')
            }
        });
    }
}

for (var x = -100; x < 140; x += 6) {
    for (var y = -60; y < 60; y += 20) {
        features0.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [x, y]
            },
            properties: {
                'marker-color': '#000',
                'marker-symbol': 'star-stroked',
                title: [x, y].join(',')
            }
        });
    }
}

myLayer0.setGeoJSON({
    type: 'FeatureCollection', 
    features: features0
});

myLayer.setGeoJSON({
    type: 'FeatureCollection',
    features: features
});

map.on('move', function() {

    // Construct an empty list to fill with onscreen markers.
    var inBounds = [],
    // Get the map bounds - the top-left and bottom-right locations.
    bounds = map.getBounds();

    // For each marker, consider whether it is currently visible by comparing
    // with the current map bounds.
    activeLayer.eachLayer(function(marker) {
        if (bounds.contains(marker.getLatLng()) && inBounds.length < 60) {
            inBounds.push(marker.options.title);
        }
    });
    // Display a list of markers.
    document.getElementById('coordinates').innerHTML = inBounds.join('\n');


});

var times = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];

$("#something").text(times[0]);

$("#slider").slider({

    min: 0,
    max: times.length-1,
    step: 1, 
    animate: true,
    //make changes to the map here
    slide: function(event, ui){

        $("#something").text(times[ui.value]);  
        if(ui.value % 2 == 0){
            console.log("even");
           map.removeLayer(myLayer0);
           map.addLayer(myLayer);
           activeLayer = myLayer;
        }
        else{
            console.log("odd"); 
            map.removeLayer(myLayer);
            map.addLayer(myLayer0);
            activeLayer = myLayer0;
        }

        // Construct an empty list to fill with onscreen markers.
        var inBounds = [],
        // Get the map bounds - the top-left and bottom-right locations.
        bounds = map.getBounds();

        // For each marker, consider whether it is currently visible by comparing
        // with the current map bounds.
        activeLayer.eachLayer(function(marker) {
            if (bounds.contains(marker.getLatLng()) && inBounds.length < 60) {
                inBounds.push(marker.options.title);
            }
        });
        // Display a list of markers.
        document.getElementById('coordinates').innerHTML = inBounds.join('\n');
    }
});

L.mapbox.accessToken = 'pk.eyJ1IjoiYmVlcnllMjgiLCJhIjoiY2lob2owdHFuMHVlcXRjbHppYjk3bnVtMyJ9.c9O7alSJC22CPlwNuiWOOw';
var map = L.mapbox.map('map', 'mapbox.streets');
//var myLayer = L.mapbox.featureLayer().addTo(map);
//var myLayer0 = L.mapbox.featureLayer();

var myLayer = new L.MarkerClusterGroup();

//var myLayer0 = new L.MarkerClusterGroup();

var features = [];

var activeLayer = myLayer;

var features = [];

var features0 = [];

/*

//loop through the DELPHI data, pushing feature objects into the array
for (var x = -120; x < 120; x += 20) {
    for (var y = -80; y < 80; y += 10) {
        var marker = L.marker(new L.LatLng(x, y), {
            icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
            title: [x, y].join(',')
        });

        marker.bindPopup("stuff");
        myLayer.addLayer(marker);
    }
}

for (var x = -100; x < 140; x += 6) {
    for (var y = -60; y < 60; y += 20) {
        var marker = L.marker(new L.LatLng(x, y), {
            icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
            title: [x, y].join(',')
        });

        marker.bindPopup([x, y].join(','));
        myLayer0.addLayer(marker);
    }
}

*/

//map.addLayer(myLayer);


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

//get initial (midnight) crime data
$.get("/getTimeCrimeData?time=0", function(response){

    for(var i = 0; i < response.length; i++){

        var marker = L.marker(new L.LatLng(response[i].lat, response[i].lng), {

            icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
            title: response[i].charge_description
        });

        marker.bindPopup([response[i].lat, response[i].lng].join(','));
        myLayer.addLayer(marker);
    }

    map.addLayer(myLayer);
});

$("#slider").slider({

    min: 0,
    max: times.length-1,
    step: 1, 
    animate: true,
    //make changes to the map here
    slide: function(event, ui){

        //switch the active layer when slider slides
        $("#something").text(times[ui.value]); 

        myLayer.eachLayer(function(marker) {
            myLayer.removeLayer(marker);
        });

        $.get("/getTimeCrimeData?time="+ui.value, function(response){

            for(var i = 0; i < response.length; i++){

                var marker = L.marker(new L.LatLng(response[i].lat, response[i].lng), {

                    icon: L.mapbox.marker.icon({'marker-symbol': 'post', 'marker-color': '0044FF'}),
                    title: response[i].charge_description
                });

                marker.bindPopup([response[i].lat, response[i].lng].join(','));
                myLayer.addLayer(marker);
            }

            map.addLayer(myLayer);
        });

        map.addLayer(myLayer);

        /*

        if(ui.value % 2 == 0){
           map.removeLayer(myLayer0);
           map.addLayer(myLayer);
           activeLayer = myLayer;
        }
        else{
            map.removeLayer(myLayer);
            map.addLayer(myLayer0);
            activeLayer = myLayer0;
        }

    */
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

L.mapbox.accessToken = 'pk.eyJ1IjoiYmVlcnllMjgiLCJhIjoiY2lob2owdHFuMHVlcXRjbHppYjk3bnVtMyJ9.c9O7alSJC22CPlwNuiWOOw';


var southWest = L.latLng(32.476625, -117.700736),
    northEast = L.latLng(33.840018, -116.169991),
    bounds = L.latLngBounds(southWest, northEast);


var map = L.mapbox.map('map', 'mapbox.streets', {

   maxBounds: bounds,
   maxZoom: 20,
   minZoom: 9
});
//var myLayer = L.mapbox.featureLayer().addTo(map);
//var myLayer0 = L.mapbox.featureLayer();



var myLayer = new L.MarkerClusterGroup({
    disableClusteringAtZoom: 14 
});

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
});

var times = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];

$("#something").text(times[0]);

//get initial (midnight) crime data
$.get("/getTimeCrimeData?time=0", function(response){

    for(var i = 0; i < response.length; i++){

        var marker;

        var icon; 

        switch(response[i].charge_description){
            case "Assault":
               icon = "../img/assault.png";
               break;
            case "Arson": 
                icon = "../img/arson.png";
                break;
            case "Child Abuse": 
                icon = "../img/child_abuse.png";
                break;
            case "DUI":
                icon = "../img/dui.png";
                break;
            case "Elder Abuse":
                icon = "../img/elder_abuse.png";
                break;
            case "Drunk in Public":
                icon = "../img/intox.png";
                break;
            case "Loitering":
                icon = "../img/loitering.png";
                break;
            case "Murder": 
                icon = "../img/murder.png";
                break;
            case "Rape": 
                icon = "../img/sex_assault.png";
                break;
            case "Possession of Substance":
                icon = "../img/substance.png";
                break;
            case "Theft":
                icon = "../img/theft.png";
                break;
            case "Vandalism": 
                icon = "../img/vandalism.png";
                break;
            case "Possession of Weapon":
                icon = "../img/weapon.png";
                break;
            default:
                icon = "../img/question.png";
        }

        marker = L.marker(new L.LatLng(response[i].lat, response[i].lng), {

            icon: L.icon({
                iconUrl: icon,
                iconSize: [35, 35],
                iconAnchor: [17, 34]
            }),
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

        $.get("/getTimeCrimeData?time="+ui.value, function(response){

            myLayer.eachLayer(function(marker) {
                myLayer.removeLayer(marker);
            });

            for(var i = 0; i < response.length; i++){

                var marker;

                var icon; 

                switch(response[i].charge_description){
                    case "Assault":
                       icon = "../img/assault.png";
                       break;
                    case "Arson": 
                        icon = "../img/arson.png";
                        break;
                    case "Child Abuse": 
                        icon = "../img/child_abuse.png";
                        break;
                    case "DUI":
                        icon = "../img/dui.png";
                        break;
                    case "Elder Abuse":
                        icon = "../img/elder_abuse.png";
                        break;
                    case "Drunk in Public":
                        icon = "../img/intox.png";
                        break;
                    case "Loitering":
                        icon = "../img/loitering.png";
                        break;
                    case "Murder": 
                        icon = "../img/murder.png";
                        break;
                    case "Rape": 
                        icon = "../img/sex_assault.png";
                        break;
                    case "Possession of Substance":
                        icon = "../img/substance.png";
                        break;
                    case "Theft":
                        icon = "../img/theft.png";
                        break;
                    case "Vandalism": 
                        icon = "../img/vandalism.png";
                        break;
                    case "Possession of Weapon":
                        icon = "../img/weapon.png";
                        break;
                    default:
                        icon = "../img/question.png";
                }

                marker = L.marker(new L.LatLng(response[i].lat, response[i].lng), {

                    icon: L.icon({
                        iconUrl: icon,
                        iconSize: [35, 35],
                        iconAnchor: [17, 34]
                    }),
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

        });
       
    }
});

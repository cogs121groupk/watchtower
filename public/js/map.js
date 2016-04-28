L.mapbox.accessToken = 'pk.eyJ1IjoiYmVlcnllMjgiLCJhIjoiY2lob2owdHFuMHVlcXRjbHppYjk3bnVtMyJ9.c9O7alSJC22CPlwNuiWOOw';


var southWest = L.latLng(32.476625, -117.700736),
    northEast = L.latLng(33.840018, -116.169991),
    bounds = L.latLngBounds(southWest, northEast);


var map = L.mapbox.map('map', 'mapbox.streets', {

   maxBounds: bounds,
   scrollWheelZoom: false,
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

var times = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];

$("#something").text("Current Time: "+times[0]);

var crimes = {};

var crimes2 = [];

var pie;

map.once('focus', function(){
    map.scrollWheelZoom.enable();
});

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

        marker.bindPopup(response[i].charge_description);
        myLayer.addLayer(marker);
    }

    map.addLayer(myLayer);

    myLayer.eachLayer(function(marker) {
         if (bounds.contains(marker.getLatLng())) {
            if(!(marker.options.title in crimes)){
                crimes[marker.options.title] = 1;
            }else{
                crimes[marker.options.title]++;
            }
        }
    });

    for(var key in crimes){

        var a = {
            label: key,
            value: crimes[key]
        }

        crimes2.push(a);
    }

    pie = new d3pie("pie", {

        "size": {

          "canvasHeight": 475,

          "canvasWidth":475

        },

        "header": {

            "title": {

              "text": "Crimes in View:",

              "fontSize": 50,

              "font": "verdana"

            }

          },

        "data": {

          "content": crimes2

        },
        "labels":{

            "outer": {
                "format": "none",
                "pieDistance": 32
                },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
                "fontSize": 15,
                "color": "white"
            },
            "percentage": {
                "color": "#ffffff",
                "decimalPlaces": 0,
                "fontSize": 20
            },
            "value": {
                "color": "white",
                "fontSize": 10
            },
            "lines": {
                "enabled": false
            },
            "truncation": {
                "enabled": true
            }
        },
        "effects": {
            "load": {
                "effect": "none"
            },
            "pullOutSegmentOnClick": {
                "effect": "linear",
                "speed": 400,
                "size": 8
            }
        },
        "tooltips": {
            "enabled": true,
            "type": "placeholder",
            "string": "{label}: {value}",
            "styles": {
                "fontSize": 22
            }
        },
    });
});

map.on('moveend', function() {

   // Construct an empty list to fill with onscreen markers.
    var inBounds = [],
    // Get the map bounds - the top-left and bottom-right locations.
    bounds = map.getBounds();

    var crimes = {};

    var crimes2 = [];

    // For each marker, consider whether it is currently visible by comparing
    // with the current map bounds.
    activeLayer.eachLayer(function(marker) {
         if (bounds.contains(marker.getLatLng())) {
            if(!(marker.options.title in crimes)){
                crimes[marker.options.title] = 1;
            }else{
                crimes[marker.options.title]++;
            }
        }
    });

    for(var key in crimes){

        var a = {
            label: key,
            value: crimes[key]
        }

        crimes2.push(a);
    }

     pie.updateProp("data.content", crimes2);
});

$("#slider").slider({

    min: 0,
    max: times.length-1,
    step: 1, 
    animate: true,
    //make changes to the map here
    slide: function(event, ui){

        //switch the active layer when slider slides
        $("#something").text("Current Time: "+times[ui.value]); 

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

                marker.bindPopup(response[i].charge_description);
                myLayer.addLayer(marker);
            }

            map.addLayer(myLayer);
        });

        map.addLayer(myLayer);

        // Construct an empty list to fill with onscreen markers.
        var inBounds = [],
        // Get the map bounds - the top-left and bottom-right locations.
        bounds = map.getBounds();

        var crimes = {};

        var crimes2 = [];

        // For each marker, consider whether it is currently visible by comparing
        // with the current map bounds.
        activeLayer.eachLayer(function(marker) {
             if (bounds.contains(marker.getLatLng())) {
                if(!(marker.options.title in crimes)){
                    crimes[marker.options.title] = 1;
                }else{
                    crimes[marker.options.title]++;
                }
            }
        });

        for(var key in crimes){

            var a = {
                label: key,
                value: crimes[key]
            }

            crimes2.push(a);
        }

         pie.updateProp("data.content", crimes2);
    }
}).each(function() {

    // Get the options for this slider (specified above)
    var opt = $(this).data().uiSlider.options;

    // Get the number of possible values
    var vals = opt.max - opt.min;

    // Position the labels
    for (var i = 0; i <= vals; i++) {

        // Create a new element and position it with percentages
        var el = $('<label style = "position: absolute">' + (i + opt.min) + '</label>').css('left', (i/vals*100) + '%');

        // Add the element inside #slider
        $("#slider").append(el);

    }
});

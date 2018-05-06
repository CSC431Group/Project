$(document).ready(function() {
 //Assign the map variable and the view to that variable


  	var map = L.map('map').setView([41.7896, -87.5996], 15);
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '<a href="http://openstreetmap.org/copyright">OpenStreetMap Contributors</a>'
    }).addTo(map);
    //creates layers to draw on
    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    //options for the respective things
    var options = {
    	//where it will go
        position: 'topright',
        //options for drawing the shapes and stuff
        draw: {
        	marker:{

            },
            polyline: {
                shapeOptions: {
                    color: '#f357a1',
                    weight: 10
                }
            },
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#44FF43'
                }
            },
            circle: false, // Turns off this drawing tool
            rectangle: false,

            circlemarker: false


        },
        //options for editing and deleting
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: true
        }
    };
    //add the draw toolbar
    var drawControl = new L.Control.Draw(options);
    map.addControl(drawControl);
    //event handler for when you start drawing
    map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType,
            layer = e.layer;

        if (type === 'marker') {
            layer.bindPopup('A popup!');
        }
        if (type === 'polygon') {
            layer.bindPopup('A popup!');
        }
        if (type === 'polyline') {
            layer.bindPopup('A popup!');
        }

        editableLayers.addLayer(layer);
    });
    //event handler for when you stop drawing
    map.on(L.Draw.Event.DRAWSTOP, function (e) {
    	// get the new thing we've added

    	//window.tacos is for debugging
    	window.tacos = editableLayers._layers[Object.keys(editableLayers._layers)[Object.keys(editableLayers._layers).length -1]];

    	var newFeature = editableLayers._layers[Object.keys(editableLayers._layers)[Object.keys(editableLayers._layers).length -1]];
    	//print geoJSON rendition
    	console.log(newFeature.toGeoJSON());








    })
});

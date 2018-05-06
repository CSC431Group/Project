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

    var coords = layer._latlng;
    console.log(coords);
    //var tempMarker = featureGroup.addLayer(e.layer);
    var popupContent = '<form role="form" id="form" enctype="multipart/form-data" class = "form-horizontal" onsubmit="addMarker()">'+
    '<strong>Feature Information </strong><br>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Date Built: </strong></label>'+
    '<input type="date" placeholder="Required" id="date" name="date" class="form-control"/>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Material: </strong></label>'+
    '<select class="form-control" id="material" name="material">'+
    '<option value="Wood">Wood</option>'+
    '<option value="Clay">Clay</option>'+
    '<option value="Adobe">Adobe</option>'+
    '<option value="Tin">Tin</option>'+
    '<option value="Other">Other</option>'+
    '</select>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Capacity: </strong></label>'+
    '<input type="number" min="0" class="form-control" id="capacity" name="capacity">'+
    '</div>'+
    //...
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Description: </strong></label>'+
    '<textarea class="form-control" rows="6" id="descrip" name="descript">...</textarea>'+
    '</div>'+
    '<input style="display: none;" type="text" id="lat" name="lat" value="'+coords.lat.toFixed(6)+'" />'+
    '<input style="display: none;" type="text" id="lng" name="lng" value="'+coords.lng.toFixed(6)+'" />'+
    '<div class="form-group">'+
    '<div style="text-align:center;" class="col-xs-4 col-xs-offset-2"><button type="button" class="btn">Cancel</button></div>'+
    '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="submit" class="btn btn-primary trigger-submit">Submit</button></div>'+
    '</div>'+
    '</form>';
    layer.bindPopup(popupContent,{
      keepInView: true,
      closeButton: false
    }).openPopup();

    $("#form").submit(function(e){
      e.preventDefault();
      console.log("didn't submit");
      var date =$("#date").val();
      console.log(date);
    });
    // if (type === 'marker') {
    //   layer.bindPopup('A popup!');
    // }
    // if (type === 'polygon') {
    //   layer.bindPopup('A popup!');
    // }
    // if (type === 'polyline') {
    //   layer.bindPopup('A popup!');
    // }

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

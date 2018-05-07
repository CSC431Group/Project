// Get a reference to the database service
var database = firebase.database();




$(document).ready(function() {
  //Assign the map variable and the view to that variable


  var map = L.map('map').setView([11.040881, -74.825576], 18);

  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '<a href="http://openstreetmap.org/copyright">OpenStreetMap Contributors</a>'
  }).addTo(map);
  //creates layers to draw on

  Window.mapLayer = new L.FeatureGroup();
  map.addLayer(Window.mapLayer);
  Window.map = map;
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
          message: 'Warning intersection' // Message that will show when intersect
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
    edit: false,
    delete: false
  };



  //reads the data in
  readMap();




  //add the draw toolbar
  var drawControl = new L.Control.Draw(options);
  map.addControl(drawControl);


  //event handler for when you start drawing
  map.on(L.Draw.Event.CREATED, function (e) {

    var type = e.layerType;
    layer = e.layer;
    Window.mapLayer.addLayer(layer);
    var coords = layer._latlngs;

    //var tempMarker = featureGroup.addLayer(e.layer);
    var popupContent = '<form role="form" id="form" enctype="multipart/form-data" class = "form-horizontal">'+
    '<strong>Feature Information </strong><br>'+

    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
    '<input type="text" min="0" class="form-control" id="name" name="name">'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Material: </strong></label>'+
    '<select class="form-control" id="material" name="material">'+
    '<option value="Wood">Wood</option>'+
    '<option value="Tin">Tin</option>'+
    '<option value="Cement">Cement</option>'+
    '<option value="Adobe">Adobe</option>'+
    '</select>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Has Water: </strong></label>'+
    '<select class="form-control" id="hasWater" name="hasWater">'+
    '<option value="Yes">Yes</option>'+
    '<option value="No">No</option>'+
    '</select>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Has Electricity: </strong></label>'+
    '<select class="form-control" id="hasElectricity" name="hasElectricity">'+
    '<option value="Yes">Yes</option>'+
    '<option value="No">No</option>'+
    '</select>'+
    '</div>'+

    //...
    '<div class="form-group">'+

    '<div style="text-align:center;" class="col-xs-4"><button type="submit" value="submit" class="btn btn-primary trigger-submit">Submit</button></div>'+
    '</div>'+
    '</form>';
    layer.bindPopup(popupContent,{
      keepInView: true,
      closeButton: true
    }).openPopup();

    $("#form").submit(function(e)
    {
      e.preventDefault();



      layer._popup.remove();
      layer.unbindPopup(popupContent);
      addFeature()

    });




  });

});
  //event handler for when you stop drawing

function addFeature(){
  var newFeature = Window.mapLayer._layers[Object.keys(Window.mapLayer._layers)[Object.keys(Window.mapLayer._layers).length -1]];
      //print geoJSON rendition
  var geoObj = newFeature.toGeoJSON()
  var hasWater =$("#hasWater").val();
  var name =$("#name").val();
  var material = $("#material").val();
  var hasElectricity = $("#hasElectricity").val();
  geoObj.properties = {
    name : name,
    material : material,
    hasWater : hasWater,
    hasElectricity: hasElectricity
  }

  firebase.database().ref('features/').push({
      geoObj
  });
}

function readMap(){
  //for each thing use drawThing function and have it link popUp
  var featureRef = firebase.database().ref('features/');
  featureRef.on('value', function(snapshot) {

    for (var key in snapshot.val()){
      drawFeature(key, snapshot.val()[key].geoObj);
    }

  });
}
function edit(key, layerNumber){

  //add form as new popupcontent
  var layer = Window.mapLayer._layers[layerNumber]
  layer._popup.remove();
  layer.unbindPopup();


  var popupContent = '<form role="form" id="form1" enctype="multipart/form-data" class = "form-horizontal">'+
    'Edit Feature Information: <br>'+

    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Name: </strong></label>'+
    '<input type="text" min="0" class="form-control" id="name" name="name">'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Material: </strong></label>'+
    '<select class="form-control" id="material" name="material">'+
    '<option value="Wood">Wood</option>'+
    '<option value="Tin">Tin</option>'+
    '<option value="Cement">Cement</option>'+
    '<option value="Adobe">Adobe</option>'+
    '</select>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Has Water: </strong></label>'+
    '<select class="form-control" id="hasWater" name="hasWater">'+
    '<option value="Yes">Yes</option>'+
    '<option value="No">No</option>'+
    '</select>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Has Plumbing: </strong></label>'+
    '<select class="form-control" id="hasPlumbing" name="hasPlumbing">'+
    '<option value="Yes">Yes</option>'+
    '<option value="No">No</option>'+
    '</select>'+
    '</div>'+
    '<div class="form-group">'+
    '<label class="control-label col-sm-5"><strong>Has Electricity: </strong></label>'+
    '<select class="form-control" id="hasElectricity" name="hasElectricity">'+
    '<option value="Yes">Yes</option>'+
    '<option value="No">No</option>'+
    '</select>'+
    '</div>'+

    //...
    '<div class="form-group" style="text-align: right; margin-top: 10px;">'+

    '<button type="submit" value="submit" class="btn btn-primary style="display: inline; margin-top: 5px; margin-left: 100px;" trigger-submit">Submit</button>'+
    '<button style="display: inline; margin-left: 5px;" onclick="rebindInfoPop(`'+ layerNumber + '`)">Cancel</button>'
    '</div>'+
    '</form>';



  layer.bindPopup(popupContent,{
    keepInView: true,
    closeButton: true
  }).openPopup()


  $("#form1").submit(function(e)
    {
      e.preventDefault();



      layer._popup.remove();
      layer.unbindPopup(popupContent);
      editFeature(key)

    });

}

function rebindInfoPop(layerNumber){
  var layer = Window.mapLayer._layers[layerNumber]



  var layer = Window.mapLayer._layers[layerNumber]
  layer._popup.setContent(layer.infoPop)

}
function editFeature(key){
  var hasWater =$("#hasWater").val();
  var name =$("#name").val();
  var hasElectricity =$("#hasElectricity").val();
  var material =$("#material").val();


  firebase.database().ref('features/'+key+'/geoObj/properties').set({
      name : name,
      hasWater : hasWater,
      hasElectricity : hasElectricity,
      material : material

  });
}
function deleteFeature(key){
  firebase.database().ref('features/'+key).remove();
  location.reload();
}

function drawFeature(key, featureInfo){


    Window.mapLayer.addLayer(L.geoJson(featureInfo.geometry));
    var layer = Window.mapLayer._layers[Object.keys(Window.mapLayer._layers)[Object.keys(Window.mapLayer._layers).length -1]]
    var popupContent = '<div><strong>Name:</strong> ' + featureInfo.properties.name + '</div><div><strong>Material:</strong> ' + featureInfo.properties.material + '</div><div><strong>Has Access To Water: </strong>' + featureInfo.properties.hasWater +
      '<div><strong>Has Electricty:</strong>  ' + featureInfo.properties.hasElectricity +
      ' </div><button type = "button" id = "editButton" style="margin-left: 110px; margin-top: 15px;" onclick="edit(`'  + key + '`,' + layer._leaflet_id + ')">Edit</button><button type = "button" id = "deleteButton" onclick="deleteFeature(`'  + key + '`)" style="display: inline; margin-left: 5px; margin-top: 00px;">Delete</button>';


    layer.infoPop = popupContent;
    layer.bindPopup(popupContent,{
      keepInView: true,
      closeButton: true
    })
}

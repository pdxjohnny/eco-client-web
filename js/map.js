var addMarker = function (map, thing) {
  if (typeof thing.name === 'undefined' || thing.name.length < 1) {
    thing.name = "Name"
  }
  if (typeof thing.description === 'undefined' || thing.description.length < 1) {
    thing.description = "Description"
  }
  if (typeof thing.state === 'undefined' || thing.state.length < 1) {
    thing.state = "on"
  }
  var position = {};
  position.lng = Number(thing.longitude);
  position.lat = Number(thing.latitude);

  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: thing.name,
    draggable: false
  });

  if (thing.description === 'missing') {
    marker.setIcon('https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png')
  } else {
    marker.setIcon('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png')
  }

  var startEditing = function (event) {
    console.log('Now editing', marker.draggable);
    $('#name').attr('contenteditable', true);
    $('#description').attr('contenteditable', true);
    marker.setDraggable(true);
    google.maps.event.clearListeners(marker, 'dragstart');
    marker.addListener('dragstart', function (event) {
      console.log('Dragging marker:', marker.getPosition());
    });
    marker.addListener('dragend', function (event) {
      console.log('Done dragging marker:', marker.getPosition());
    });
  };

  var endEditing = function (event) {
    console.log('endEditing');
    $('#name').attr('contenteditable', false);
    $('#description').attr('contenteditable', false);
    marker.setDraggable(false);
    google.maps.event.clearListeners(marker, 'dragstart');
    google.maps.event.clearListeners(marker, 'dragend');
  };

  var saveEditing = function (event) {
    console.log('saveEditing');
    endEditing();
    thing.name = $('#name').text();
    thing.description = $('#description').text();
    thing.longitude = marker.getPosition().lng();
    thing.latitude = marker.getPosition().lat();

    if (thing.description === 'missing') {
      marker.setIcon('https://mt.google.com/vt/icon?color=ff004C13&name=icons/spotlight/spotlight-waypoint-blue.png')
    } else {
      marker.setIcon('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png')
    }

    console.log('About to save thing:', thing);
    API.SaveThing(thing['_id'] || thing['id'], thing, function (data) {
      console.log('Success saving thing:', data);
      if (data.UpsertedId !== null) {
        thing['_id'] = data.UpsertedId;
        console.log(thing['_id']);
      }
    },
    function (err) {
      console.log('ERROR while saving edited thing:', err);
    });
  };

  var interact = function(event) {
    console.log('Interaction', marker.draggable);
    map.panTo(marker.getPosition());
    $('#popup').modal('show');
    $('#action').unbind();
    $('#cancel').unbind();
    $('#cancel').on('mousedown', endEditing);
    if (marker.draggable === false) {
      $('#actionText').text('Edit');
      $('#cancel').hide();
      $('#action').on('mousedown', startEditing);
    } else {
      $('#actionText').text('Save Edits');
      $('#cancel').show();
      $('#action').on('mousedown', saveEditing);
    }
    for (var prop in thing) {
      if (thing.hasOwnProperty(prop)) {
        $('#'+prop).text(thing[prop]);
      }
    }
  };
  marker.addListener('click', interact);
  marker.interact = interact;
  marker.startEditing = startEditing;
  marker.endEditing = endEditing;
  marker.saveEditing = saveEditing;
  return marker;
};

  function initMap() {
    var map;
    $('#addThing').on('mousedown', function (event) {

      API.GetLocation(function (data) {
        console.log('Got location', data);
        var newThing = {
          longitude: data.coords.longitude,
          latitude: data.coords.latitude,
        }
        var marker = addMarker(map, newThing);
        marker.startEditing();
        marker.interact();
      });
    });

    var center = {};
    API.GetLocation(function (data) {
      console.log('Got location', data);
      center.lng = data.coords.longitude;
      center.lat = data.coords.latitude;

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: center
      });

      var options = {
        longitude: center.lng,
         latitude: center.lat,
         radius: 10 * 5000
      };
      API.GetNear(options, function (data) {
        // console.log('Got things', data);
        if (data['rows'] === null) {
          console.log('Rows is null, theres nothing here');
          return;
        }

        for (var i = 0; i < data['rows'].length; i++) {
          var thing = data['rows'][i];
          // console.log('Got thing', thing);
          addMarker(map, thing);
        }
      },
      function (data) {
        console.error('ERROR getting near', data);
      }
    );
    },
    function (data) {
      console.error('ERROR getting location', data);
    }
  );
}

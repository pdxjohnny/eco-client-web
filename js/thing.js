$(document).ready(function () {
  $('#addItem').click(function (event) {
    AddItem();
  });
  $('#submit').click(function (event) {
    $('#thingFormErrors').hide();
    var object = FormToObject();
    API.SaveThing(object['_id'], object,
      function (data) {
        $('#thingFormErrors').hide();
        SetResult(object);
      },
      function (error) {
        if (typeof error.responseJSON !== 'undefined' &&
          typeof error.responseJSON.Error !== 'undefined') {
          $('#thingFormErrors').text(error.responseJSON.Error);
        } else {
          $('#thingFormErrors').text('There was an error saving');
        }
        $('#thingFormErrors').show();
      }
    );
  });
});

var displayThing = function (id) {
  if (typeof id === 'string' && id.length > 0) {
    ShowForm(id,
      function (data) {
        $('#username').text(id);
        SetResult(data);
      },
      function (error) {
        ClearResult();
        $('#form').hide();
      }
    );
  } else {
    ClearResult();
    $('#form').hide();
  }
};

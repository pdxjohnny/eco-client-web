$(document).ready(function () {
  displaySearch();
  var user = API.User();
  $('#addThing').click(function (event) {
    var name = $('#thing_search').val();
    if (typeof name === 'undefined') {
      name = '';
    }
    window.location.hash = '#id=' + name;
    API.GetLocation(function (position) {
      console.log(position);
      var data = {
        'name': name,
        'longitude': position.coords.longitude,
        'latitude': position.coords.latitude,
        'description': '',
        'image': '',
      };
      var item = SetItem(data);
      // UpdateListeners();
      $('#formItems')[0].data_change = function (data) {
        $('#thing_search').val(data['name']);
        window.location.hash = '#id=' + data['name'];
        SetResult(data);
      }
      $('#form').show();
    });
  });
  $('#thing_search').keyup(function (event) {
    window.location.hash = '#id=' + $('#thing_search').val();
    displaySearch();
  });
  $('#homeLink').click(function (event) {
    $('#thing_search').val('');
    displayThing(undefined);
    lastSearch = '';
  });
});

// Without lastSearch functionality Ctrl-a does not work
var lastSearch = '';
var displaySearch = function () {
  var id = API.PageParams()['id'];
  if (lastSearch === id) {
    return;
  }
  displayThing(id);
  $('#thing_search').val(id);
  lastSearch = id;
};

$(document).ready(function () {
  $('#loginForm').submit(function (event) {
    event.preventDefault();
    var object = {};
    $(this).serializeArray().map(function (x) {
      object[x.name] = x.value;
    });
    loggingInShow();
    API.LoginUser(object,
      function (data) {
        loggingInHide();
        $('#loginFormErrors').hide();
        console.log('Logged in', data);
        if (data.hasOwnProperty('token')) {
          API.SetToken(data.token);
          location.href = '/';
        } else {
          $('#loginFormErrors').text('There was an error loging in');
        }
      },
      function (error) {
        loggingInHide();
        if (typeof error.responseJSON !== 'undefined' &&
          typeof error.responseJSON.Error !== 'undefined') {
          $('#loginFormErrors').text(error.responseJSON.Error);
        } else {
          $('#loginFormErrors').text('There was an error loging in');
        }
        $('#loginFormErrors').show();
      }
    );
    return false;
  });
});

var loggingInShow = function () {
  $('#loggingIn').modal('setting', 'closable', false).modal('show');
};

var loggingInHide = function () {
  $('#loggingIn').modal('hide');
};

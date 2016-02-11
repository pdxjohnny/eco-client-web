$(document).ready(function () {
  $('#registerForm').submit(function (event) {
    event.preventDefault();
    var object = {};
    $(this).serializeArray().map(function (x) {
      object[x.name] = x.value;
    });
    // For some reason if there is an error this will not
    // show the loader on  subsequent calls unless it is
    // called twice
    registeringShow();
    registeringShow();
    console.log('show');
    API.RegisterUser(object,
      function (data) {
        registeringShow();
        console.log("Register success", data);
        API.LoginUser(object,
          function (data) {
            console.log('Logged in', data);
            if (data.hasOwnProperty('token')) {
              API.SetToken(data.token);
              location.href = '/';
            } else {
              $('#loginFormErrors').text('There was an error loging in');
            }
          },
          function (error) {
            registeringHide();
            console.log('hide');
            if (typeof error.responseJSON !== 'undefined' &&
              typeof error.responseJSON.Error !== 'undefined') {
              $('#registerFormErrors').text(error.responseJSON.Error);
            } else {
              $('#registerFormErrors').text('There was an error loging in');
            }
            $('#registerFormErrors').show();
          }
        );
      },
      function (error) {
        registeringHide();
        console.log('hide');
        if (typeof error.responseJSON !== 'undefined' &&
          typeof error.responseJSON.Error !== 'undefined') {
          $('#registerFormErrors').text(error.responseJSON.Error);
        } else {
          $('#registerFormErrors').text('There was an error registering');
        }
        $('#registerFormErrors').show();
      }
    );
    return false;
  });
});

var registeringShow = function () {
  $('#registering').modal('setting', 'closable', false).modal('show');
};

var registeringHide = function () {
  $('#registering').modal('hide');
};

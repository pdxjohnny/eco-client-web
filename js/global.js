$(document).ready(function () {
  // NOTE: Will re enable when there is auth
  // sendToLogin();
  // API.OnError(401, function (error) {
  //   sendToLogin(true);
  // });
  // check for Geolocation support
  if (!(navigator.geolocation)) {
    alert('Sorry you can\t help out right now because geolocation is not enabled!');
  }
});

var sendToLogin = function (badToken) {
  // Redirect the user if they are not logged in
  if ((badToken === true || API.GetToken() === '') &&
    location.pathname !== '/user/login/' &&
    location.pathname !== '/user/register/') {
    location.href = '/user/login/';
  }
}

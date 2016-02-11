var MakeAPI = function () {
  // this.server = location.origin;
  this.server = "https://couch.carpoolme.net/";
  this.tokenCookieName = 'token';
  this.token = '';
  this.onError = {};
  this.URLMaping = {
    'ws': '/api/ws',
    'thing': '/api/thing/:id',
    'login': '/api/user/login',
    'refresh': '/api/user/refresh',
    'register': '/api/user/register',
  };
  // Web socket related
  this.connected = false;
  this.messages = [];
  this.sender = false;
  this.ws = false;
  // Set the default server
  this.change_server(location.origin.split("//")[1]);
  // For location data
  this.lastLocation = {};
  this.location = {};
  return this;
};

MakeAPI.prototype.PageParams = function () {
  var pairs = location.hash.substr(1).split('&').map(function (pair) {
    var kv = pair.split('=', 2);
    return [decodeURIComponent(kv[0]), kv.length === 2 ? decodeURIComponent(kv[1]) : null];
  });
  var asObject = {};
  for (var i = 0; i < pairs.length; i++) {
    asObject[pairs[i][0]] = pairs[i][1]
  }
  return asObject;
};

MakeAPI.prototype.User = function () {
  var token = this.GetToken();
  token = token.split('.');
  try {
    token[1] = JSON.parse(window.atob(token[1]));
  } catch (e) {
    console.log('Invalid token', token);
    token[1] = {};
  }
  return token[1];
};

MakeAPI.prototype.GetCookie = function (cookieName) {
  var name = cookieName + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
};

MakeAPI.prototype.GetToken = function (token) {
  this.token = this.GetCookie(this.tokenCookieName);
  return this.SetToken(this.token);
};

MakeAPI.prototype.SetToken = function (token) {
  this.token = token;
  var setCookie = this.tokenCookieName + '=' + this.token + '; ' +
    'path=/';
  document.cookie = setCookie;
  $.ajaxSetup({
    headers: {
      'Authorization': 'Bearer ' + this.token
    }
  });
  return this.token;
};

MakeAPI.prototype.GenericRequest = function (url, object, callback, errorCallback) {
  var request = {
    type: 'GET',
    url: this.server + url,
    success: function (data) {
      if (typeof callback === 'function') {
        callback(data);
      }
    }.bind(this),
    error: function (data) {
      console.log(data.status, typeof this.onError[data.status]);
      if (typeof this.onError[data.status] === 'function') {
        this.onError[data.status](data);
      }
      if (typeof errorCallback === 'function') {
        errorCallback(data);
      }
    }.bind(this)
  };
  if (object !== null) {
    request['type'] = 'POST';
    request['contentType'] = 'application/json';
    request['data'] = JSON.stringify(object);
  }
  $.ajax(request);
};

MakeAPI.prototype.OnError = function (errorCode, callback) {
  this.onError[errorCode] = callback;
};

MakeAPI.prototype.GetThing = function (id, callback, errorCallback) {
  var url = this.URLMaping['thing'];
  url = url.replace(/:id/g, id);
  this.GenericRequest(url, null, callback, errorCallback);
};

MakeAPI.prototype.SaveThing = function (id, data, callback, errorCallback) {
  var url = "eco";
  // var url = this.URLMaping['thing'];
  // url = url.replace(/:id/g, id);
  this.GenericRequest(url, data, callback, errorCallback);
};

MakeAPI.prototype.change_server = function (url) {
  var protocol = location.protocol.replace('http', 'ws');
  this.origin = protocol + "//" + location.origin.split("//")[1] + this.URLMaping['ws'];
};

MakeAPI.prototype.connect = function () {
  this.ws = new WebSocket(this.origin);
  this.ws.onopen = this.onopen.bind(this);
  this.ws.onclose = this.onclose.bind(this);
  this.ws.onmessage = this.onmessage.bind(this);
};

MakeAPI.prototype.onopen = function (data) {
  this.connected = true;
  this.sendall();
};

MakeAPI.prototype.onclose = function (data) {
  this.connected = false;
};

MakeAPI.prototype.onmessage = function (data) {
  try {
    data = JSON.parse(data["data"])
  } catch (err) {
    console.error("Could not decode", data["data"]);
  }
  if (typeof data["Method"] !== "undefined" &&
    typeof this[data["Method"]] === "function") {
    this[data["Method"]](data);
  }
};

MakeAPI.prototype.send = function (data) {
  this.messages.push(data);
  this.sendall();
};

MakeAPI.prototype.sendall = function (data) {
  if (this.connected) {
    for (var message = 0; message < this.messages.length; message++) {
      this.messages[message] = JSON.stringify(this.messages[message]);
      this.ws.send(this.messages[message]);
      this.messages = this.messages.slice(1);
    }
  }
};

MakeAPI.prototype.GetLocation = function (callback, errorCallback) {
  if (navigator.geolocation) {
    var geoSuccess = function(position) {
        this.lastLocation = this.location;
        this.location = position;
        if (typeof callback === 'function') {
          callback(position);
        }
    }.bind(this);
    navigator.geolocation.getCurrentPosition(geoSuccess, errorCallback);
  }
};

API = new MakeAPI();

function SetResult(result) {
  ClearResult();
  result = Result(result);
  $('#results')[0].appendChild(result);
}

function ClearResult() {
  $('#results').html('');
}

function AddResult(result) {
  result = Result(result);
  $('#results')[0].appendChild(result);
}

function Result(object) {
  var item = BasicCard(object);
  for (var prop in object) {
    if (object.hasOwnProperty(prop) && prop !== 'name') {
      var description = document.createElement('div');
      description.className = 'description';
      description.innerText = prop.charAt(0).toUpperCase() + prop.slice(1) +
        ':  ';
      var linkMaker = Links.get(prop);
      var link = linkMaker(prop, object[prop]);
      description.appendChild(link);
      item.content.appendChild(description);
    }
  }
  return item;
}

function BasicCard(object) {
  var item = document.createElement('div');
  item.className = 'ui centered card';
  if (typeof object['email'] === 'string') {
    var profilePic = document.createElement('img');
    profilePic.className = 'image';
    profilePic.src = gravatar(object['email'], {
      size: 200,
      rating: 'pg',
      backup: 'retro',
      secure: true
    });
    profilePic.onload = function (event) {
      this.height = this.width;
      this.width = this.height;
    };
    item.appendChild(profilePic);
    item.profilePic = profilePic;
  }
  var content = document.createElement('div');
  content.className = 'content';
  item.appendChild(content);
  item.content = content;
  var header = document.createElement('a');
  header.className = 'header';
  header.innerText = object['name'];
  header.href = '/#id=' + object['name'];
  content.appendChild(header);
  item.header = header;
  return item;
}

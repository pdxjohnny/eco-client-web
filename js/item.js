function SetItem(existingThing) {
  $('#formItems').html('');
  var primary = new Item();
  primary.formKey.style.display = 'none';
  primary.formKey.value = 'name';
  primary.formValue.placeholder = 'Name (Giant Panda, Red Breasted Sapsucker)'
  AppendToForm(primary);
  if (typeof existingThing !== 'undefined') {
    primary.formValue.value = existingThing['name'];
    for (var prop in existingThing) {
      if (existingThing.hasOwnProperty(prop) && prop !== 'name') {
        var item = new Item(prop, existingThing[prop]);
        AppendToForm(item);
      }
    }
  } else {
    var item = new Item();
    AppendToForm(item);
  }
  return primary;
}

function AddItem() {
  var item = new Item();
  AppendToForm(item);
  return item;
}

function Item(key, value) {
  var item = document.createElement('div');
  item.className = 'item ui input';
  // This the key, it is an thing type
  item.formKey = document.createElement('input');
  item.formKey.type = 'text';
  item.formKey.placeholder = 'Type (animal, building)';
  item.appendChild(item.formKey);
  // This the value, it is an thing name
  item.formValue = document.createElement('input');
  item.formValue.type = 'text';
  item.formValue.placeholder = 'Categoy (bird, skyscraper)';
  item.appendChild(item.formValue);
  // This the delete button, for deleting a field
  item.formDelete = document.createElement('div');
  item.formDelete.innerHTML = 'Delete';
  item.formDelete.className = 'ui button';
  item.formDelete.onclick = function (event) {
    this.parentNode.parentNode.removeChild(this.parentNode);
  }
  item.appendChild(item.formDelete);
  // Set the keys if they are not defined
  if (typeof key !== 'undefined' && typeof value !== 'undefined') {
    item.formKey.value = key;
    item.formValue.value = value;
  }
  return item;
}

function AppendToForm(object) {
  $('#formItems')[0].appendChild(object);
  UpdateListeners();
}

function UpdateListeners() {
  var inputs = $('#formItems').find('input');
  for (var i = 0; i < inputs.length; i++) {
    console.log(inputs[i]);
    inputs[i].onchange = $('#formItems')[0].data_change;
  }
}

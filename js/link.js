function Linker(argument) {
  return this;
}

Linker.prototype.get = function (service) {
  if (typeof this[service] === 'function') {
    return this[service].bind(this);
  }
  return this.generic.bind(this);
};

Linker.prototype.genericElement = function () {
  var linkElement = document.createElement('a');
  linkElement.className = 'link';
  linkElement.target = '_blank';
  return linkElement;
};

Linker.prototype.generic = function (index, value) {
  var link = this.genericElement();
  link.href = 'https://' + index + ".com/" + value;
  link.innerText = '@' + value;
  return link;
};

Linker.prototype.email = function (index, value) {
  var link = this.genericElement();
  link.href = 'mailto:' + value;
  link.innerText = value;
  return link;
};

var Links = new Linker();

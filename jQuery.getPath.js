if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    var jQuery = require('jQuery');
    console.log('test');
  }
}

jQuery.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';
    var path, node = this;

    if(node[0].getAttribute('id')){ //return id only if it exists
      var id = node[0].getAttribute('id');
      return '#' + id;
    }

    var addClass = true; //to make sure class selector fires once at maximum

    while (node) {
        var realNode = node[0];
        if (!realNode.localName) break; //something's wrong with the selected element

        var name = realNode.localName.toLowerCase();
        var parent = node.parent();
        var siblings = parent.children(name);

        if(realNode.getAttribute('class') && 
          addClass && 
          realNode.getAttribute('class') !== '' &&
          realNode.getAttribute('class') !== '__kiwi'){
            // name+= '.' + realNode.getAttribute('class');
            name += '.' + realNode.getAttribute('class').split(" ").join('.');
            console.log('added class: ', name);
            addClass = false;
        }

        if (siblings.length > 1) {
          name += ':eq(' + siblings.index(realNode) + ')';
        }
        if(name !== 'tbody') {
          path = name + (path ? '>' + path : '');
          console.log('path: ', path);
        }
        node = parent;
    }
    debugger;
    console.log(path);
    return path;
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = getPath;
  }
}

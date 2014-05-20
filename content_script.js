jQuery.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';

    var path, node = this;
    while (node.length) {
        var realNode = node[0], name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();

        var parent = node.parent();

        var siblings = parent.children(name);
        if (siblings.length > 1) { 
            name += ':eq(' + siblings.index(realNode) + ')';
        }

        path = name + (path ? '>' + path : '');
        node = parent;
    }

    return path;
};

$('*').index(this);

var toggleBackground = function() {
  $('body').toggle(function () {
    $("body").css({'background-color': "gray"});
  }, function () {
      $("#user_button").css({'background-color': "inherit"});
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.shibal) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
    var $el = $(window.getSelection().anchorNode.parentNode);

    // var index = $('*').index(this);

    // // Restore element.
    // var $this = $('*').eq(index);

    if(sel) {
      sendResponse({
        user: 'sean',
        path: $el.getPath(),
        text: selectedText,
        url: window.location.href
      });
    }
  }
    // sendResponse({farewell: "goodbye"});
});




// initContentScript();

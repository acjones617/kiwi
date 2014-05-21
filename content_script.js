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
        if(name !== 'tbody') {
          path = name + (path ? '>' + path : '');
        }
        node = parent;
    }

    return path;
};

jQuery.fn.getTitle = function() {
  return $('html').find('title').text();
};

$('*').index(this);

var toggleSelectMode = function() {
  $('body').toggleClass('__kiwi');
};

var noticeUser = function() {
  $('body').prepend('<div class="__kiwiSuccess" style="background-color: blue">YOU ADDED SOMETHING</div>');
  setTimeout(function() {
    $('.__kiwiSuccess').remove();
  }, 3000);
};

var init = function() {
  var css = '.__kiwi *:hover { border: 1px solid blue; }';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  toggleSelectMode();
  if (request.shibal) {
    $('body *').one('click', function(e) {
      var selectedText = $(this).text();
      var $el = $(this);
      if(selectedText !== '') {
        chrome.storage.sync.get('__kiwi', function(result) {
          var response = {
            email: result.__kiwi,
            title: $el.getTitle(),
            path: $el.getPath(),
            text: selectedText,
            url: window.location.href
          };
          sendResponse(response);
          // $('body *').off('click', '*');
          noticeUser();
        });
      }
    });
    // toggleSelectMode();

    return true;
  }
});


init();


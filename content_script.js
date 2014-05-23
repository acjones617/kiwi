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

        if (siblings.length > 1) {
          if(realNode.getAttribute('class') && addClass){
            name+= '.' + realNode.getAttribute('class');
            console.log('added class: ', name);
            addClass = false;
          }
          name += ':eq(' + siblings.index(realNode) + ')';
        }
        if(name !== 'tbody') {
          path = name + (path ? '>' + path : '');
          console.log('path: ', path);
        }
        node = parent;
    }

    console.log(path);
    return path;
};

jQuery.fn.getTitle = function() {
  return $('html').find('title').text();
};

$('*').index(this); //possibly delete

var toggleSelectMode = function() {
  $('body').toggleClass('__kiwi'); //add class kiwi to just body tag
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
    style.styleSheet.cssText = css; //possibly delete
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  toggleSelectMode();
  if (request.shibal) {
    $('body *').on('click', function(e) {
      console.log('clicked');
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
          debugger;
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


jQuery.fn.getTitle = function() {
  return $('html').find('title').text();
};

var notifyUser = function() {
  $('body').prepend('<div class="__kiwiSuccess" style="background-color: blue">YOU ADDED SOMETHING</div>');
  setTimeout(function() {
    $('.__kiwiSuccess').remove();
  }, 3000);
};

var init = function() {
  var css = '.__kiwi:hover { border: 1px solid blue; }';
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

var getTodayInString = function() {
 var today = new Date();
 return today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var triggered = false;

  var mouseEnter = function(event) {
    $('.__kiwi').removeClass('__kiwi');
    $(event.target).addClass('__kiwi');

    $(this).one('click', function(event) {
      if(!triggered) {
        triggered = true;
        $('.__kiwi').removeClass('__kiwi');
        event.preventDefault();
        var selectedText = $(event.target).text();
        var $el = $(event.target);
        if(selectedText !== '') {
          chrome.storage.sync.get('__kiwi', function(result) {
            var response = {
              email: result.__kiwi,
              title: $el.getTitle(),
              path: $el.getPath(),
              url: window.location.href,
              values: [{ 
                  date: getTodayInString(),
                  value: selectedText}]
            };
            
            // remove the 'mouseenter' handler from all nodes so
            // that no new nodes can be selected after user clicks one
            $('*').off('mouseenter', mouseEnter);
            
            sendResponse(response);
            notifyUser();
          });
        }
      }
    });
  };

  var mouseLeave = function(event) {
    $('.__kiwi').off('click');
    $(event.target).removeClass('__kiwi');
  };

  if (request.createKiwi) {
    $('*').on('mouseenter', mouseEnter);
    $('*').on('mouseleave', mouseLeave);
    $('*').on('keyup', function(e) {
      if (e.keyCode === 27) {
        $('*').off('mouseenter', mouseEnter);
      }
    });
  }
  return true;
});


init();

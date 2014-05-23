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

var turnParentsOff = function() {

};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var triggered = false;

  if (request.shibal) {
    $('*').hover(function(event) { //mouse over stuff
      $('.__kiwi').removeClass('__kiwi');
      $(event.target).addClass('__kiwi');


        $(this).one('click', function(event) {
          if(!triggered){
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
                  text: selectedText,
                  url: window.location.href
                };
                sendResponse(response);
                noticeUser();
              });
            }
          } // end if
        });
    }, function(event) { //mouse out
      $('.__kiwi').off('click');
      $(event.target).removeClass('__kiwi');
    });
  }
  return true;
});


init();


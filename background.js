var isLoggedIn = function(login, addKiwi, tab) {
  chrome.cookies.get({
    url: 'http://localhost:9000/special',
    name: 'kiwiSpecial'
  }, function(cookie) {
    if(cookie) {
      addKiwi(tab);
    } else {
      login();
    }
  });
};

var logIn = function() {
  var w = 440;
  var h = 220;
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/2); 

  chrome.windows.create({
    'url': 'http://localhost:9000/special', 
    'type': 'popup', 
    'width': w, 
    'height': h, 
    'left': left, 
    'top': top} , function(window) {
  });
};

/**
 * checks cookies before pushing
 * @param  {[type]} message [message to be pushed to the db]
 */
var checkCookies = function(callback) {
  chrome.cookies.getAll({url: 'http://localhost:9000/special'},
    function (cookies) {
      var kiwiSpecial;
      var kiwiUid;
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].name === 'kiwiSpecial') {
          kiwiSpecial = cookies[i].value; 
        }
        if (cookies[i].name === 'kiwiUid') {
          kiwiUid = cookies[i].value; 
        }
      }
      if(kiwiUid) {
        var db = new Firebase('https://kiwidb.firebaseio.com/users/' + kiwiUid + '/kiwis');
        db.auth(kiwiSpecial, function(err, result) {
          if (err) {
            console.log('Login Failed. Error:', err);
          } else {
            callback(db);
          }
        });
      }
    }
  );
};

var pushKiwi = function(tab) {
  checkCookies(function(db) {
    chrome.tabs.sendMessage(tab.id, { createKiwi: true }, function(response) {
      console.log('Right before sending to DB: ', response);
      console.log('Sending to DB:');
      db.push(response);
    });
  });
};

function initBackground() {
  chrome.browserAction.onClicked.addListener(function(tab) {
    isLoggedIn(logIn, pushKiwi, tab);
  });
}

initBackground();

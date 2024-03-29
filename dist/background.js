(function() {
  window.configs = {
    url: "http://kiwirunner.azurewebsites.net",
    chromeLoginView: "/special",
    firebaseDbUrl: "https://kiwidb.firebaseio.com/users/",
    kiwisView: "/kiwis",
    displayDelay: 2000,
    kiwiLimit: 15
  };

}).call(this);


/*
checks cookies before pushing
param  {[type]} message [message to be pushed to the db]
 */

(function() {
  var checkCookies, initBackground, isLoggedIn, logIn, pushKiwi;

  initBackground = function() {
    chrome.browserAction.onClicked.addListener(function(tab) {
      isLoggedIn(logIn, pushKiwi, tab);
    });
  };

  isLoggedIn = function(login, addKiwi, tab) {
    chrome.cookies.get({
      url: configs.url + configs.chromeLoginView,
      name: "kiwiSpecial"
    }, function(cookie) {
      if (cookie) {
        addKiwi(tab);
      } else {
        login();
      }
    });
  };

  logIn = function() {
    var h, w;
    w = 440;
    h = 220;
    chrome.windows.create({
      url: configs.url + configs.chromeLoginView,
      type: "popup",
      width: w,
      height: h
    }, function(window) {});
  };

  checkCookies = function(tab, callback) {
    chrome.cookies.getAll({
      url: configs.url + configs.chromeLoginView
    }, function(cookies) {
      var db, i, kiwiSpecial, kiwiUid;
      kiwiSpecial = void 0;
      kiwiUid = void 0;
      i = 0;
      while (i < cookies.length) {
        if (cookies[i].name === "kiwiSpecial") {
          kiwiSpecial = cookies[i].value;
        }
        if (cookies[i].name === "kiwiUid") {
          kiwiUid = cookies[i].value;
        }
        i++;
      }
      if (kiwiUid) {
        db = new Firebase(configs.firebaseDbUrl + kiwiUid + configs.kiwisView);
        db.auth(kiwiSpecial, function(err, result) {
          if (err) {
            logIn();
          } else {
            callback(db);
          }
        });
      }
    });
  };

  pushKiwi = function(tab) {
    checkCookies(tab, function(db) {
      chrome.tabs.sendMessage(tab.id, {
        createKiwi: true
      }, function(response) {
        console.log("Sending to DB:", response);
        db.push(response);
        return true;
      });
      return true;
    });
    return true;
  };

  initBackground();

}).call(this);

function initBackground() {

  var db = new Firebase('https://kiwidb.firebaseio.com/');

  chrome.browserAction.onClicked.addListener(
    function(tab) {
      // console.log('whuttt');
      // alert('sending message');
      // chrome.tabs.sendMessage(tab.id, );
      debugger;
      chrome.tabs.sendMessage(tab.id, { shibal: true }, function(response) {
        debugger;
        db.push(response);
        console.log(response);
      });
    }
  );
}

initBackground();

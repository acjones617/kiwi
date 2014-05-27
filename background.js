function initBackground() {

  var db = new Firebase('https://kiwidb.firebaseio.com/');

  chrome.browserAction.onClicked.addListener(
    function(tab) {
      // console.log('whuttt');
      // alert('sending message');
      // chrome.tabs.sendMessage(tab.id, );
      chrome.tabs.sendMessage(tab.id, { createKiwi: true }, function(response) {
        console.log('Right before sending to DB: ', response);
        console.log('Sending to DB:');
        db.push(response);
      });
    }
  );
}

initBackground();

function initBackground() {

  var db = new Firebase('https://kiwidb.firebaseio.com/users/facebook:10103897713367983');

  chrome.browserAction.onClicked.addListener(
    function(tab) {
      // console.log('whuttt');
      // alert('sending message');
      // chrome.tabs.sendMessage(tab.id, );
      
      // var w = 440;
      // var h = 220;
      // var left = (screen.width/2)-(w/2);
      // var top = (screen.height/2)-(h/2); 

      // chrome.windows.create({
      //   'url': 'http://localhost:9000/special/login/route', 
      //   'type': 'popup', 
      //   'width': w, 
      //   'height': h, 
      //   'left': left, 
      //   'top': top} , function(window) {
        
      // });
      
/*FOR TESTING OF ADDING NEW USER TO DB*/
      // var response = {
      //     'age': 50,
      //     'kiwis': {
      //       'kiwiHash01': {
      //         'url': 'http://www.google.com',
      //         'title': 'Google, Inc.',
      //         'path': 'html>body>div>table>tbody>span',
      //         'values': {
      //           'valueHash01': {
      //             'date': '2014-4-27',
      //             'value': '50'
      //           },
      //           'valueHash02': {
      //             'date': '2014-4-28',
      //             'value': '54'
      //           }
      //         }
      //       }
      //     }
      //   };

      // console.log('Sending response to Firebase next...');
      // db.set(response, function(err) {
      //     if (err) {
      //       console.log('Ther was an error saving to Firebase.  Error: ', err);
      //     } else {
      //       console.log('Data sent to Firebase successfully.');  
      //     }
      // });
      
      chrome.cookies.get({url: 'http://localhost:9000', name: 'firebaseSessionKey'},
        function (cookie) {
          if (cookie) {
            console.log(cookie.value);
            // CONTINUE FROM HERE: try getting the cookie stored in the background page
            // Another option might be trying to store the cookie in the content script
            chrome.cookies.set({url: 'chrome-extension://piokfjnabjpdlpgollhhcpdnbdnhcifp', name:'firebaseSessionKey', value: cookie.value});
          }
          else {
            console.log('Can\'t get cookie! Check the name!');
          }
        }
      );


      db.once('value', function(snapshot) {
        console.log(snapshot.val());
      });





      // chrome.tabs.sendMessage(tab.id, { createKiwi: true }, function(response) {
      //   console.log('Right before sending to DB: ', response);
      //   console.log('Sending to DB:');
      //   db.push(response);
      // });
    }
  );
}

initBackground();

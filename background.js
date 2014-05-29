function initBackground() {


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
      


      // console.log('Sending response to Firebase next...');
      // db.set(response, function(err) {
      //     if (err) {
      //       console.log('Ther was an error saving to Firebase.  Error: ', err);
      //     } else {
      //       console.log('Data sent to Firebase successfully.');  
      //     }
      // });


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
          var db = new Firebase('https://kiwidb.firebaseio.com/users/' + kiwiUid);
          db.auth(kiwiSpecial, function(err, result) {
            if (err) {
              console.log('Login Failed. Error:', err);
            } else {
              db.push({hello: 'ANOTHER MESSAGE PLEASE WORK!'});
            }
          });
        }
      );

      // var dataRef = new Firebase("https://kiwidb.firebaseio.com/");
      // //Log me in
      // dataRef.auth("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0MDE0MjI3OTgsInYiOjAsImQiOnsiaWQiOiIxMDEwMzkwMTQ4NDYyMDM2MyIsInVpZCI6ImZhY2Vib29rOjEwMTAzOTAxNDg0NjIwMzYzIiwicHJvdmlkZXIiOiJmYWNlYm9vayJ9LCJpYXQiOjE0MDEzMzYzOTh9.rckaiacA305TYnmXYYA5j6Ko_MawpHIWvfPrumbUOLU",
      //   function(error, result) {
      //     if(error) {
      //       console.log("Login Failed!", error);
      //     } else {
      //       console.log('Authenticated successfully with payload:', result.auth);
      //       console.log('Auth expires at:', new Date(result.expires * 1000));
      //     }
      //   }
      // );      

      // db.once('value', function(snapshot) {
      //   console.log(snapshot.val());
      // });





      // chrome.tabs.sendMessage(tab.id, { createKiwi: true }, function(response) {
      //   console.log('Right before sending to DB: ', response);
      //   console.log('Sending to DB:');
      //   db.push(response);
      // });
    }
  );
}

initBackground();

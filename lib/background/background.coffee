###
checks cookies before pushing
param  {[type]} message [message to be pushed to the db]
###

initBackground = ->
  chrome.browserAction.onClicked.addListener (tab) ->
    isLoggedIn logIn, pushKiwi, tab
    return
  return
isLoggedIn = (login, addKiwi, tab) ->
  chrome.cookies.get
    url: configs.url + configs.chromeLoginView
    name: "kiwiSpecial"
  , (cookie) ->
    if cookie 
      addKiwi tab
    else
    
      login()
    return
  return

logIn = ->
  w = 440
  h = 220
  chrome.windows.create
    url: configs.url + configs.chromeLoginView
    type: "popup"
    width: w
    height: h
  , (window) ->

  return

checkCookies = (tab, callback) ->
  chrome.cookies.getAll 
    url: configs.url + configs.chromeLoginView
  , (cookies) ->
    kiwiSpecial = undefined
    kiwiUid = undefined
    i = 0
    while i < cookies.length 
      kiwiSpecial = cookies[i].value  if cookies[i].name is "kiwiSpecial"
      kiwiUid = cookies[i].value  if cookies[i].name is "kiwiUid"
      i++
    if kiwiUid
      db = new Firebase(configs.firebaseDbUrl + kiwiUid + configs.kiwisView)
      # Firebase.goOnline()
      db.auth kiwiSpecial, (err, result) ->
        if err
          do logIn
        else 
          arr = []
          db.once "value", (snapshot) ->

            for key of snapshot.val()
              arr.push key
            if arr.length >= configs.kiwiLimit
              chrome.tabs.sendMessage tab.id,
                alertUser: true
            else 
              callback db
        return

    return

  return

pushKiwi = (tab) ->
  checkCookies tab, (db) ->
    chrome.tabs.sendMessage tab.id,
      createKiwi: true
    , (response) ->
      return Firebase.goOffline() if response.canceled #close connection
      console.log "Right before sending to DB: ", response
      console.log "Sending to DB:"
      db.push response
      console.log response, "response"
      Firebase.goOffline()
      return true

    return true

  return

initBackground()

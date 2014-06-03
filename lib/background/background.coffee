###
checks cookies before pushing
param  {[type]} message [message to be pushed to the db]
###

initBackground = ->
  chrome.browserAction.onClicked.addListener (tab) ->
    #what is tab?
    isLoggedIn logIn, pushKiwi, tab #calling isLoggedIn function, passing logIn and pushKiwi functions as variables (not invoked yet!)
    return
  return
#only gets called if user clicks on a potential kiwi (tab)? or is it when a user clicks on the chrome extention?
isLoggedIn = (login, addKiwi, tab) ->
  #pushKiwi turns into addKiwi
  chrome.cookies.get #calling a get method on chrom.cookkies, not too sure how the url and name works?
    url: configs.url + configs.chromeLoginView
    name: "kiwiSpecial"
  , (cookie) ->
  #checking to see if cookie exists, if it does call the pushKiwi function, passing tab, I assume that tab is the kiwi obj?
    if cookie 
      addKiwi tab
    else
    #if cookie does not exist, then envoke login
      login()
    return
  return
#only gets called if not already logged in (chrome.cookies.get renders no cookies)
logIn = ->
  # renders login view popup in window, by caling chrome.windows.create and by passing the url of configs login view which is /special the login through fb page
  w = 440
  h = 220
  chrome.windows.create
    url: configs.url + configs.chromeLoginView
    type: "popup"
    width: w
    height: h
  , (window) ->

  return

#gets called first thing when pushKiwi is called, really unsure about what this does
checkCookies = (callback) ->
  chrome.cookies.getAll #returns an array of all cookies?
    url: configs.url + configs.chromeLoginView
  , (cookies) ->
    kiwiSpecial = undefined
    kiwiUid = undefined
    i = 0
    while i < cookies.length #iterates over cookies array
      #setting cokkies[i].value to var kiwispecial is cookies[i].name is kiwispecial, same but not really also below
      kiwiSpecial = cookies[i].value  if cookies[i].name is "kiwiSpecial"
      kiwiUid = cookies[i].value  if cookies[i].name is "kiwiUid"
      i++
      #if kiwiuid create a new db connection 
    if kiwiUid
      db = new Firebase(configs.firebaseDbUrl + kiwiUid + configs.kiwisView)
      Firebase.goOnline()
      db.auth kiwiSpecial, (err, result) ->
        if err
          do logIn
        else
        # what is result? console.log result
          callback db
        return

    return

  return

numberOfKiwis = (db) ->
  #must establish db connection for specific user based on cookie id, then check number of kiwis, then act acordenly 
  db = new Firebase(configs.firebaseDbUrl) # == new Firebase('https://kiwidb.firebaseio.com/users/'
  # + uid + /kiwis --> count number of kiwis, or kiwi hashs  
  # would this work? new Firebase('https://kiwidb.firebaseio.com/users/' + $cookies.kiwiUid + '/kiwis/


  console.log db.val()
#gets called only if user is aready loggin and (chrome.cookies.get renders a cookie)
pushKiwi = (tab) ->
  
  #call Number of kiwis function here!
  #calls checkCookies, only moves on if kiwiUid and passes db =  Firebase(configs.firebaseDbUrl + kiwiUid + configs.kiwisView)
  checkCookies (db) ->
    # I can just throw the function here -- db should be the instance call of FB that I want 
   # console.log db.val()
    #numberOfKiwis (db) ->
    # a bit unsure
    chrome.tabs.sendMessage tab.id,
      createKiwi: true
    , (response) ->
      return Firebase.goOffline() if response.canceled #close connection
      console.log "Right before sending to DB: ", response #response === kiwi clicked on
      console.log "Sending to DB:"
      db.push response
      console.log response, "response"
      Firebase.goOffline()
      return

    return

  return

# numberOfKiwis = ->
#   db = new Firebase(configs.firebaseDbUrl + kiwiUid + configs.kiwisView)

#calles initBackground, to start all order of events! sneaky !!, I need to check if user has 20+ kiwis, and if so dont let them save more and notify them of restriction, and I need to enable logout, eek>:(
initBackground()

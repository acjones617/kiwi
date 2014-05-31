jQuery.fn.getTitle = ->
  $("html").find("title").text()

notifyUser = (message) ->
  $("body").prepend """
      <div class='__kiwiSuccess'
           style='background-color: #FAFF9A;
                  position: fixed;
                  z-index: 1000;
                  color: black;
                  font-family: Helvetica;
                  height: 40px;
                  width: 96%;
                  padding: 10px 10px;
                  margin: 10px 12px;'>
                  #{message}</div>
                  """
  setTimeout (->
    $(".__kiwiSuccess").fadeOut "slow"
    return
  ), configs.displayDelay
  return

init = ->
  css = ".__kiwi:hover { border: 1px solid blue; }"
  head = document.head or document.getElementsByTagName("head")[0]
  style = document.createElement("style")
  style.type = "text/css"
  if style.styleSheet
    style.styleSheet.cssText = css #possibly delete
  else
    style.appendChild document.createTextNode(css)
  head.appendChild style
  return

getTodayInString = ->
  today = new Date()
  today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate()

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
  triggered = false
  notifyUser "Please select an element with numeric values for tracking."
  mouseEnterHandler = (event) ->
    $(".__kiwi").removeClass "__kiwi"
    $(event.target).addClass "__kiwi"
    $(this).one "click", clickHandler
    return

  clickHandler = (event) ->
    unless triggered
      triggered = true
      $(".__kiwi").removeClass "__kiwi"
      event.preventDefault()
      selectedText = $(event.target).text()
      $el = $(event.target)
      if selectedText isnt ""
        chrome.storage.sync.get "__kiwi", (result) ->
          
          # email: result.__kiwi,
          response =
            title: $el.getTitle()
            path: $el.getPath()
            url: window.location.href
            values: [
              date: getTodayInString()
              value: selectedText
            ]

          
          # remove the 'mouseenter' handler from all nodes so
          # that no new nodes can be selected after user clicks one
          $("*").off "mouseenter", mouseEnterHandler
          sendResponse response
          notifyUser "Your item has been added for tracking. Check them out <a href='#{configs.url}/#{configs.kiwisView}'>here</a>"
          return

      else
        notifyUser "Please select an element with a trackable value."
    return

  mouseLeaveHandler = (event) ->
    $(".__kiwi").off "click"
    $(event.target).removeClass "__kiwi"
    return

  if request.createKiwi
    $("*").on "mouseenter", mouseEnterHandler
    $("*").on "mouseleave", mouseLeaveHandler
    
    # to allow user to get out of node-selection mode after 
    # clicking on the extension by clicking escape key
    $("*").on "keyup", (e) ->
      if e.keyCode is 27
        $(".__kiwi").removeClass "__kiwi"
        $("*").off "mouseenter", mouseEnterHandler
        $("*").off "click", clickHandler
      return

    return true
  true

init()

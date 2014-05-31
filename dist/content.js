(function() {
  window.configs = {
    url: "http://localhost:9000",
    chromeLoginView: "/special",
    firebaseDbUrl: "https://kiwidb.firebaseio.com/users/",
    kiwisView: "/kiwis",
    displayDelay: 3000
  };

}).call(this);

(function() {
  jQuery.fn.getPath = function() {
    var addClass, id, index, name, node, parent, path, realNode, siblings;
    if (this.length !== 1) {
      throw "Requires one element.";
    }
    path = void 0;
    node = this;
    if (node[0].getAttribute("id")) {
      id = node[0].getAttribute("id");
      return "#" + id;
    }
    addClass = true;
    while (node) {
      realNode = node[0];
      if (!realNode.localName) {
        break;
      }
      name = realNode.localName.toLowerCase();
      parent = node.parent();
      siblings = parent.children(name);
      if (realNode.getAttribute("class") && addClass && realNode.getAttribute("class") !== "" && realNode.getAttribute("class") !== "__kiwi") {
        name += "." + realNode.getAttribute("class").split(" ").join(".");
        addClass = false;
      }
      path = name + (path ? ">" + path : "");
      node = parent;
    }
    if ($(path) !== $(this)) {
      index = $(path).index($(this));
      path += ":eq(" + index + ")";
    }
    return path;
  };

}).call(this);

(function() {
  var getTodayInString, init, isTooDeep, isValidNode, notifyUser;

  jQuery.fn.getTitle = function() {
    return $("html").find("title").text();
  };

  jQuery.fn.removeAttrIfEmpty = function() {
    if ($(this).attr('class') === '') {
      return $(this).removeAttr('class');
    }
  };

  notifyUser = function(message) {
    $('.__kiwiSuccess').remove();
    $("body").prepend("<div class='__kiwiSuccess'\n     style='background-color: #FAFF9A;\n            position: fixed;\n            z-index: 9000;\n            color: black;\n            font-family: Helvetica;\n            height: 40px;\n            width: 96%;\n            padding: 10px 10px;\n            margin: 10px 12px;'>\n            " + message + "</div>");
    $(".__kiwiSuccess").delay(configs.displayDelay).fadeTo(5000, 0, function() {
      return $(this).remove();
    });
    $(".__kiwiSuccess").on({
      mouseleave: function() {
        return $(this).delay(configs.displayDelay).fadeTo(5000, 0, function() {
          return $(this).remove();
        });
      },
      mouseenter: function() {
        return $(this).stop().fadeTo(500, 1);
      }
    });
  };

  init = function() {
    var css, head, style;
    css = ".__kiwi:hover { border: 1px solid blue; }";
    head = document.head || document.getElementsByTagName("head")[0];
    style = document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  };

  getTodayInString = function() {
    var today;
    today = new Date();
    return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
  };

  isTooDeep = function(node, levels, count) {
    var children, i;
    if (count == null) {
      count = 0;
    }
    if (count > levels) {
      return true;
    } else {
      children = $(node).children();
      if (children.length > 3) {
        return true;
      }
      if (children.length) {
        i = 0;
        while (i < children.length) {
          i++;
          return isTooDeep($(node).children()[i], levels, count++);
        }
      }
      return false;
    }
  };

  isValidNode = function(node) {
    var nonos;
    nonos = ['img', 'button', 'input'];
    return !_.contains(nonos, node.localName);
  };

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var clickHandler, mouseEnterHandler, mouseLeaveHandler, triggered;
    triggered = false;
    notifyUser("Please select an element with numeric values for tracking.");
    mouseEnterHandler = function(event) {
      $(".__kiwi").removeClass("__kiwi");
      $(event.target).addClass("__kiwi");
      $(this).one("click", clickHandler);
    };
    clickHandler = function(event) {
      var $el, selectedElement, selectedText;
      event.preventDefault();
      if (!triggered) {
        triggered = true;
        $(".__kiwi").removeClass("__kiwi");
        event.preventDefault();
        selectedText = $(event.target).text();
        selectedElement = $(this);
        $el = $(event.target);
        if (selectedText !== "" && isValidNode(this)) {
          chrome.storage.sync.get("__kiwi", function(result) {
            var response;
            response = {
              title: $el.getTitle(),
              path: $el.getPath(),
              url: window.location.href,
              values: [
                {
                  date: getTodayInString(),
                  value: selectedText
                }
              ]
            };
            $("*").off("mouseenter", mouseEnterHandler);
            sendResponse(response);
            notifyUser("Your item has been added for tracking. Check them out <a href='" + configs.url + "/" + configs.kiwisView + "'>here</a>");
          });
        } else {
          triggered = false;
          notifyUser("Please select an element with a trackable value.");
        }
      }
    };
    mouseLeaveHandler = function(event) {
      $(".__kiwi").off("click");
      $(event.target).removeClass("__kiwi");
      $(event.target).removeAttrIfEmpty();
    };
    if (request.createKiwi) {
      $("*").on("mouseenter", mouseEnterHandler);
      $("*").on("mouseleave", mouseLeaveHandler);
      $("*").on("keyup", function(e) {
        if (e.keyCode === 27) {
          $(".__kiwi").removeClass("__kiwi");
          $("*").off("mouseenter", mouseEnterHandler);
          $("*").off("click", clickHandler);
        }
      });
      return true;
    }
    return true;
  });

  init();

}).call(this);

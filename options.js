// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
(function() {
  window.configs = {
    url: "http://localhost:9000",
    chromeLoginView: "/special",
    firebaseDbUrl: "https://kiwidb.firebaseio.com/users/",
    kiwisView: "/kiwis",
    displayDelay: 2000,
    kiwiLimit: 15
  };

}).call(this);

function Rule(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Rule.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('matcher').value = data.matcher;
    this.getElement('match-param').value = data.match_param;
    this.getElement('action').value = data.action;
    this.getElement('action-js').value = data.action_js;
    this.getElement('enabled').checked = data.enabled;
  }

  this.getElement('enabled-label').htmlFor = this.getElement('enabled').id =
    this.node.id + '-enabled';

  this.render();

  this.getElement('matcher').onchange = storeRules;
  this.getElement('match-param').onkeyup = storeRules;
  this.getElement('action').onchange = storeRules;
  this.getElement('action-js').onkeyup = storeRules;
  this.getElement('enabled').onchange = storeRules;

  var rule = this;
  this.getElement('move-up').onclick = function() {
    var sib = rule.node.previousSibling;
    rule.node.parentNode.removeChild(rule.node);
    sib.parentNode.insertBefore(rule.node, sib);
    storeRules();
  };
  this.getElement('move-down').onclick = function() {
    var parentNode = rule.node.parentNode;
    var sib = rule.node.nextSibling.nextSibling;
    parentNode.removeChild(rule.node);
    if (sib) {
      parentNode.insertBefore(rule.node, sib);
    } else {
      parentNode.appendChild(rule.node);
    }
    storeRules();
  };
  this.getElement('remove').onclick = function() {
    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  storeRules();
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

Rule.prototype.render = function() {
  this.getElement('move-up').disabled = !this.node.previousSibling;
  this.getElement('move-down').disabled = !this.node.nextSibling;
  this.getElement('action-js').style.display =
    (this.getElement('action').value == 'js') ? 'block' : 'none';
}

Rule.next_id = 0;

function loadRules() {
  var rules = localStorage.rules;
  try {
    JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
}

function storeRules() {
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('rules').childNodes).map(function(node) {
    node.rule.render();
    return {matcher: node.rule.getElement('matcher').value,
            match_param: node.rule.getElement('match-param').value,
            action: node.rule.getElement('action').value,
            action_js: node.rule.getElement('action-js').value,
            enabled: node.rule.getElement('enabled').checked};
  }));
}

window.onload = function() {
  loadRules();
  var arrCookies = [];
  chrome.cookies.getAll({
      url: configs.url + configs.chromeLoginView
    }, function(cookies) { 
      for(var i = 0; i < cookies.length; i++) {
        console.log(cookies[i].name)
        arrCookies.push(cookies[i].name)
      }
    })
  document.getElementById('logOut').onclick = function() {
    //must iterate over loggin cookies
    for(var i = 0; i < arrCookies.length; i++) {
      chrome.cookies.remove({
        url: configs.url + configs.chromeLoginView,
      name: arrCookies[i]
    })  
    }
    alert("you have been logged out")
  }
  document.getElementById('setEmail').onclick = function() {
    // debugger;
    // localStorage.setItem('__kiwiEmail', document.getElementById('email').value);
    chrome.storage.sync.set({ '__kiwi': document.getElementById('email').value }, function() {
      console.log('email saved!');
    });
    // chrome.storage.sync.get('__kiwiEmail', function(thing) { console.log(thing) })
  };
};

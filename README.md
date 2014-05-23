kiwi
====

## The chrome extension

The chrome extension is in control of handling the selection of data pieces that the user wants to track over time.
It is using the chrome api to communicate between background.html (the browser level logic) and content_script.html (the tab level logic).
Navigating through the Chrome extension API can be a little tricky. I would recommend reading up on the [docs](https://developer.chrome.com/extensions)
before working on the extension. 

## Tests

Currently, it is using Mocha to perform some simple tests for finding the path of the selected dom node. Feel free to expand
the tests.


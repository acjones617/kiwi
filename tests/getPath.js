var jQuery = require('jQuery');
var expect = require('chai').expect;
var getPath = require('../jQuery.getPath.js');
var jsdom = require("jsdom").jsdom;

describe('getPath', function () {
  it('should get basic path without any ids', function () {
    var dom = $('<html><div><div>Hello</div></div></html>');

    expect(dom.getPath()).to.equal('html>body>div>div');
  });
  it('should get paths with ids', function () {
    
  });
  it('should get paths with classes', function () {
    
  });
  it('should get path with classes and ids', function () {
    
  });
});
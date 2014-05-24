/* global jQuery, describe, it, expect, should */

describe('jQuery()', function () {
  'use strict';

  // beforeEach(function() {

  // });


  it('exists', function () {
    expect(jQuery.fn.getPath).to.be.a('function');

  });

  xit('does basic pathing', function () {
    var dom = $('<div></div>');
    var target = $('<div>Hello</div>');
    target.appendTo(dom);
    $('body').append(dom);

    expect(target.getPath()).to.equal('html>body>div:eq(1)>div');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();
  });

  xit('does pathing with classes', function () {
    var dom = $('<div></div>');
    var target = $('<div class="not"><div class="fun bun hun">Hello</div></div>');
    target.appendTo(dom);
    $('body').append(dom);
    
    expect(target.getPath()).to.equal('html>body>div:eq(1)>div.not'); 
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();
  });

  
  xit('does pathing with ids', function() {
    var dom = $('<div></div>');
    var target = $('<div id="fun"><div>Hello</div></div>');
    target.appendTo(dom);
    $('body').append(dom);

    expect(target.getPath()).to.equal('#fun');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });
  
  xit('returns single path if target has id', function() {
    var dom = $('<div></div>');
    var target = $('<div><div id="fun">Hello</div></div>');
    target.appendTo(dom);
    $('body').append(dom);

    expect(target.getPath()).to.equal('html>body>div:eq(1)>div');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });
//good till this one
  xit('does pathing with ids', function() {
    var dom = $('<div></div>');
    var target = $('<div id="fun" class="jin"><div class="fun bun hun">Hello</div></div>');
    target.appendTo(dom);
    $('body').append(dom);

    expect(target.getPath()).to.equal('#fun');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });

  xit('does pathing with siblings', function() {
    var dom = $('<div></div><div></div>');
    var target = $('<div class="div1"></div>');
    target.appendTo(dom);
    $('body').append(dom);

    expect(target.getPath()).to.equal('html>body>div:eq(1)>div.div1');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });

  it('does pathing with embedded siblings', function() {
    var dom = $('<div class="div1"> <div class="div2"> <div class="div3"> </div></div></div>');
    var target = $('<div class="div4"> test</div>');
    target.appendTo(dom);
    $('body').append(dom);

    expect(target.getPath()).to.equal('html>body>div:eq(1)>div.div4:eq(1)');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });
  // Add more assertions here
});

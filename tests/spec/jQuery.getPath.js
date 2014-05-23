/* global jQuery, describe, it, expect, should */

describe('jQuery()', function () {
  'use strict';

  // beforeEach(function() {

  // });


  beforeEach(function() {
    $('.target').remove();
  });

  it('exists', function () {
    expect(jQuery.fn.getPath).to.be.a('function');

  });

  it('does basic pathing', function () {
    var dom = $('<div><div>Hello</div></div>');
    var target = $('<div></div>');
    dom.append(target);
    $('body').append(dom);

    expect(target.getPath()).to.equal('html>body>div:eq(1)>div:eq(1)');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();
  });

  it('does pathing with classes', function () {
    var dom = $('<div class="not"><div class="fun bun hun">Hello</div></div>');
    var target = $('<div></div>');
    $('body').append(dom);
    $('.fun').append(target);

    expect(target.getPath()).to.equal('html>body>div.not:eq(1)>div.fun.bun.hun:eq(1)');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();
  });

  xit('does pathing with ids', function() {
    var dom = $('<div id="fun"><div>Hello</div></div>');
    var target = $('<div></div>');
    $('body').append(dom);
    $('#fun div').append(target);

    expect(target.getPath()).to.equal('html>body>div#fun>div:eq(1)');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });

  xit('returns single path if target has id', function() {
    var dom = $('<div><div id="fun">Hello</div></div>');
    var target = $('<div></div>');
    $('body').append(dom);
    $('#fun').append(target);

    expect(target.getPath()).to.equal('#fun');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });

  xit('does pathing with ids', function() {
    var dom = $('<div id="fun" class="jin"><div class="fun bun hun">Hello</div></div>');
    var target = $('<div></div>');
    $('body').append(dom);
    $('.fun').append(target);

    expect(target.getPath()).to.equal('html>body>div#fun.jin>div.fun.bun.hun:eq(1)');
    expect($(target.getPath())).to.not.equal([]);
    $('body').find(dom).remove();

  });
 

  // Add more assertions here
});

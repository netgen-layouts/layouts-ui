define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var Keys = require('intern/dojo/node!leadfoot/keys');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Blocks::Text',

    before: function() {
      page = new Page(this.remote);
      page
        .setFindTimeout(5000)
        .maximizeWindow()
    },

    beforeEach: function() {
      Page.clearStorage()
    },

    afterEach: function() {
      page.destroyAllBlocks()
    },


    'inline edit': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('title', {to_zone: 'left'}).editBlock()
          .match('[contenteditable]')
          .assertText('Title')
          .type(' is the best')
          .sleep(500)
          .waitForAjax()
        .end()
        .refresh().waitForAjax()
        .match('[contenteditable]').assertText('Title is the best');
    },


    'inline empty notice': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('title', {to_zone: 'left'}).editBlock()
          .match('[contenteditable]')
          .assertText('Title')
          .type(Keys.BACKSPACE)
          .type(Keys.BACKSPACE)
          .type(Keys.BACKSPACE)
          .type(Keys.BACKSPACE)
          .type(Keys.BACKSPACE)
        .end()
        .match('[data-inline]').assertText('Click to write')
    },




  });


});

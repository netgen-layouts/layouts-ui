define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Layout::Shared',

    before: function() {
      page = new Page(this.remote);
      page
        .setFindTimeout(5000)
        .maximizeWindow()
    },

    beforeEach: function() {
      Page.clearStorage()
    },


    'create': function() {
      var layout_name = utils.stamped('Testing shared layout');
      return page
        .navigateTo('#layout?shared=1')
        .match('.modal', {visible: true})
          .input('Name').fill(layout_name)
          .clickOn('.layout-type label:nth-of-type(2)')
          .clickOn('Create layout')
        .end()
        .sleep(200)
        .waitForAjax()
        .assertCurrentUrl(new RegExp('/.+/app/#layout/\\d+/edit'), 'match')

        .match('.app-center .layout-name', {visible: true})
          .getVisibleText()
          .then(function(out) {
            assert.include(out, layout_name)
            assert.include(out, 'shared')
          })
    }



  });



});

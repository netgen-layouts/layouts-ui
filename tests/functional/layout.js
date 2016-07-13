define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Layout',

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
      var layout_name = utils.stamped('Testing layout');
      return page
        .navigateTo('#layout')
        .match('.modal', {visible: true})
          .input('Name').fill(layout_name)
          .clickOn('.layout-type label:nth-of-type(2)')
          .clickOn('.action_apply')
        .end()
        .waitForAjax()
        .assertCurrentUrl(new RegExp('/bm/dev/app/#layout/\\d+/edit'), 'match')

        .match('.layout-name', {visible: true}).assertText(layout_name)
    },

    'rename': function() {
      var layout_name = utils.stamped('New name');
      return page
        .navigateTo('#layout/1/edit')
        .match('.app-center')
          .clickOn('.layout-name')
          .match('.js-name')
            .clearValue()
            .type(layout_name)
            .end()
          .clickOn('.btn-primary')
          .match('.js-show-form').assertText(layout_name)
    },


    'show dialog when draft exists': function() {
      return page
        .navigateTo('#layout/1')
        .match('.modal-title', {visible: true}).assertText('What would you like to do with the draft?');
    },


    'edit_existing': function() {
      return page
        .navigateTo('#layout/1')
        .clickOn('.modal .action_cancel', {visible: true})
        .waitForDeletedByCssSelector('.modal')
        .findAllByCssSelector('[data-block]')
        .then(function(elements) {
          assert.isAbove(elements.length, 0);
        })
    },



    'discard current draft and create new': function() {
      return page
        .navigateTo('#layout/1')
        .waitForAjax()
        .execute('return Core.g.layout.get("updated_at")').store('base_updated_at')
        .clickOn('.modal .action_apply', {visible: true})
        .waitForDeletedByCssSelector('[data-block]')
        .assertCurrentUrl('/edit', 'include')

        .execute('return Core.g.layout.get("updated_at")')
        .then(function(result) {
          var diff = new Date(result) - new Date(this.read('base_updated_at'));
          assert.isAbove(diff, 0, 'Layout is not recently updated');
        })
        .findAllByCssSelector('[data-block]')
        .then(function(elements) {
          assert(elements.length);
        })
        .end()
        .match('.app-center .js-show-form').assertText('My layout');


    }



  });



});

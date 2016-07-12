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

    'rename layout': function() {
      return page
        .navigateTo('#layout/1/edit')
        .setFindTimeout(5000)
        .findByCssSelector('.app-center')
        .findByCssSelector('.layout-name')
        .click()
        .end()
        .findByCssSelector('.js-name')
        .clearValue()
        .type('New layout')
        .end()
        .findByCssSelector('.btn-primary')
        .click()
        .end()
        .findByCssSelector('.js-show-form')
        .getVisibleText()
        .then(function(text) {
          assert.strictEqual(text, 'New layout')
        });
    },


    'show dialog when draft exists': function() {
      return page
        .navigateTo('#layout/1')
        .findDisplayedByCssSelector('.modal')
          .findByCssSelector('.modal-title')
          .assertText('What would you like to do with the draft?');
    },


    'edit_existing': function() {
      return page
        .navigateTo('#layout/1')
        .findDisplayedByCssSelector('.modal .action_cancel')
        .click()
        .end()
        .waitForDeletedByCssSelector('.modal')
        .findAllByCssSelector('[data-block]')
        .then(function(elements) {
          assert.isAbove(elements.length, 0);
        })
    },



    'discard current draft and create new': function() {
      var base_updated_at;

      return page
        .navigateTo('#layout/1')
        .execute('return Core.g.layout.get("updated_at")')
        .then(function(result) {
          base_updated_at = result;
        })
        .findDisplayedByCssSelector('.modal')
        .findByCssSelector('.action_apply')
        .click()
        .end()
        .end()
        .waitForDeletedByCssSelector('[data-block]')
        .getCurrentUrl()
        .then(function(result) {
          assert.include(result, '/bm/dev/app/#layout/1/edit')
        })
        .execute('return Core.g.layout.get("updated_at")')
        .then(function(result) {
          var diff = new Date(result) - new Date(base_updated_at);
          assert.isAbove(diff, 0, 'Layout is not recently updated');
        })
        .findAllByCssSelector('[data-block]')
        .then(function(elements) {
          assert(elements.length);
        })
        .end()
        .findByCssSelector('.app-center .js-show-form')
        .assertText('My layout');


    }



  });



});

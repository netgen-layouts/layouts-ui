define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Blocks::List',

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


    'add': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('list', {to_zone: 'left'})
          .match('.notice')
          .assertText('This block is empty. Please pick some items manually or use a dynamic collection.', 'include')
    },


    'only add/remove items from manual collection': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('list', {to_zone: 'left'}).editBlock()
        .clickOn('.sidebar .add-items-btn', {visible: true})
        .waitForBrowser()
        .match('.browser')
          .clickOn('.list-panel .children tr input+label')
          .clickOn('.list-panel .children tr:nth-child(2) input+label')
          .clickOn('.list-panel .children tr:nth-child(3) input+label')
          .clickOn('.action_apply')
        .end()
        .waitForAjax()
        .count('.sidebar .collection-item')
        .then(function (result) {
          assert.equal(result, 3)
        })
        .match('.sidebar .collection-item')
          .clickOn('.remove-toggle').sleep(500)
          .clickOn('.remove')
          .waitForAjax()
        .end()
        .count('.sidebar .collection-item')
        .then(function (result) {
          assert.equal(result, 2)
        })
    }


  });


});

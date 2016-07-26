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


    'add/remove items from manual collection': function() {
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
        .count('.sidebar .collection-item').assert('equal', 3)
        .count('.bm-items .collection-item .remove-toggle').assert('equal', 3)
        .match('.sidebar .collection-item')
          .clickOn('.remove-toggle').sleep(500)
          .clickOn('.remove')
          .waitForAjax()
        .end()
        .count('.sidebar .collection-item').assert('equal', 2)

    },


    'change from manual to dynamic collection': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('list', {to_zone: 'left'}).editBlock()
          .match('[data-xeditable-name="collection_type"]', {visible: true})
            .clickOn('Change')
            .select('Collection type').choose('1') // 1 = Dynamic collection
            .clickOn('Apply')
          .end()
          .waitForAjax()
          .match('[data-xeditable-name="collection_type"] .js-edit .text', {visible: true}).assertText('Dynamic collection').end()
          .input('Limit').fill("5")
          .sleep(500) //Wait for input change
          .waitForAjax()
          .count('.bm-items .collection-item').assert('equal', 5)
        .end()
        .lastBlock().count('.list-item').assert('equal', 5)
    },


    'change from manual to named collection': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('list', {to_zone: 'left'}).editBlock()
          .match('.sidebar .add-items-btn', {visible: true}).end() //Add items button should exist in manual
          .match('[data-xeditable-name="collection_type"]')
          .clickOn('.js-edit', {visible: true})
          .select('Collection type').choose('2') // 2 = Named collection
          .clickOn('.js-apply')
        .end()
        .waitForAjax()
        .match('[data-xeditable-name="collection_type"] .js-edit .text', {visible: true}).assertText('Named collection').end()
        .waitForDeletedByCssSelector('.sidebar .add-items-btn').end() //Add items button should not exist in named
        .count('.bm-items .collection-item .remove-toggle').assert('equal', 0)
        .lastBlock().count('.list-item').assert('equal', 27)
    },


    'change view type from list to grid': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('list', {to_zone: 'left'}).editBlock()
        .match('.sidebar')
          .clickOn('#design')
          .select('View type').choose('grid')
        .end()
        .waitForAjax()
        .lastBlock().match('.template_name').assertText('GRID')
    }



  });


});

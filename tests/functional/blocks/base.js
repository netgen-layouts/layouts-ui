define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Blocks',

    before: function() {
      page = new Page(this.remote);
      page
        .setFindTimeout(5000)
        .maximizeWindow()
    },

    beforeEach: function() {
      Page.clearStorage()
    },


    'add': function() {

      return page
        .navigateTo('#layout/3/edit')
        .clickOn('.left-toolbar-buttons .open-panel', {visible: true})

        .count('[data-zone="top"] [data-block]', {all: true}).store('count')
        .drag('.panel-content .add-block-btn.title').dropTo('[data-zone="top"]')

        .waitForAjax()
        .count('[data-zone="top"] [data-block]', {all: true})
        .then(function(result) {
          assert.equal(result - this.read('count'), 1)
        })

    },


    'edit': function() {
      var block,
        label = utils.stamped("Lorem ipsum"),
        css_class = utils.stamped('blue'),
        css_id = utils.stamped('main');

      return page
        .navigateTo('#layout/3/edit')
        .clickOn('[data-block]')

        .match('#sidebar', {visible: true})
          .match('.loader').end()
          .input('Block label').fill(label)
          .input('CSS class').fill(css_class)
          .input('CSS ID').fill(css_id)
          .select('Heading level').choose('h2')
        .end()

        .waitForAjax()

        .then(function() {
          return this.parent.match('.block-header .name').assertText(label)
        })

        .refresh()
        .clickOn('[data-block]')
        .waitForAjax()
        .match('#sidebar', {visible: true})
          .assertValue('Block label', label)
          .assertValue('CSS class', css_class)
          .assertValue('CSS ID', css_id)


    },



    'move': function() {
      return page
        .navigateTo('#layout/3/edit')
        .match('[data-block]', {visible: true})
          .match('.block-header')
            .moveMouseTo()
            .pressMouseButton(0)
            .sleep(100)
          .end()
        .end()

      .moveMouseTo(0, 0)
      .sleep(100)
      .match('[data-zone="right"]').moveMouseTo()
      .sleep(100)
      .releaseMouseButton(0)

    },


    'destroy': function() {
      return page
        .navigateTo('#layout/3/edit')
        .match('[data-block]').store('block')
          .clickOn('.dropdown-toggle')
          .clickOn('.js-destroy')
        .end()
        .clickOn('.modal .action_apply', {visible: true})
        .waitForAjax()
        .then(function() {
          this.read('block').isDisplayed().then(function(res) {
            assert.fail(res, 'Element should be destroyed');
          })
        })
    }

  });


});

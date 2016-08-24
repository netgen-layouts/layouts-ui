define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Blocks::Base',

    before: function() {
      page = new Page(this.remote);
      page
        .setFindTimeout(5000)
        .maximizeWindow();
    },

    beforeEach: function() {
      Page.clearStorage();
    },


    'add': function() {

      return page
        .navigateTo('#layout/3/edit')
        .waitForAjax()
        .count('[data-zone="top"] [data-block]', {all: true}).store('count')
        .addBlock('title', {to_zone: 'top'}).editBlock()

        .waitForAjax()
        .count('[data-zone="top"] [data-block]', {all: true})
        .then(function(result) {
          assert.equal(result - this.read('count'), 1);
        });

    },


    'edit': function() {
      var label = utils.stamped('Lorem ipsum'),
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
          return this.parent.match('.block-header .name').assertText(label);
        })

        .refresh()
        .clickOn('[data-block]')
        .waitForAjax()
        .match('#sidebar', {visible: true})
          .assertValue('Block label', label)
          .assertValue('CSS class', css_class)
          .assertValue('CSS ID', css_id);


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
      .releaseMouseButton(0);

    },


    'destroy': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('title', {to_zone: 'top'}).store('block')
          .clickOn('.dropdown-toggle')
          .clickOn('Delete block')
        .end()
        .inModal().clickOn('Delete').end()
        .waitForAjax()
        .then(function() {
          this.read('block').isDisplayed().then(function(res) {
            assert.fail(res, 'Element should be destroyed');
          });
        });
    },


    'destroy_via_trash': function() {
      return page
        .navigateTo('#layout/3/edit')
        .addBlock('title', {to_zone: 'top'}).store('block')
          .drag('.block-header')
          .moveMouseTo(0,0)
          .sleep(200)
          .moveMouseTo(100,100)
          .sleep(500)
          .dropTo('[data-trash]')
        .end()
        .inModal().clickOn('Delete').end()
        .waitForAjax()
        .then(function() {
          this.read('block').isDisplayed().then(function(res) {
            assert.fail(res, 'Element should be destroyed');
          });
        });
    },


    'only sidebar errors': function(){
      return page
        .navigateTo('#layout/2/edit')
        .addBlock('grid_gallery', {to_zone: 'bottom'}).editBlock().end()
        .match('#sidebar')
          .clickOn('Design')
          .input('Thumbnails per row/slide').fill('').sleep(250).waitForAjax()
          .match('.errors').assertText('This value should not be blank.').end()
          .count('.errors').assert('equal', 1)

          .input('Thumbnails per row/slide').fill('5').sleep(500).waitForAjax()
          .count('.errors').assert('equal', 0);

    }

  });


});

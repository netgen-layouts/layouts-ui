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


    'add': function() {
      var zone_top;
      return page
        .navigateTo('#layout/3/edit')
        .findByCssSelector('.left-toolbar-buttons')
        .findByCssSelector('.open-panel')
        .click()
        .end()
        .end()

      .findByCssSelector('[data-zone="top"]')
        .then(function(element) {
          zone_top = element;
        })
        .end()

      .findByCssSelector('.panel-content .add-block-btn.title')
        .moveMouseTo()
        .pressMouseButton(0)
        .sleep(100)
        .then(function() {
          this.moveMouseTo(zone_top)
        })
        .sleep(100)
        .releaseMouseButton(0)
        .end()

      .findByCssSelector('[data-zone="top"] [data-block]')

    },


    'edit': function() {
      var block,
        label = utils.stamped("Lorem ipsum"),
        css_class = utils.stamped('blue'),
        css_id = utils.stamped('main');

      return page
        .navigateTo('#layout/3/edit')
        .findByCssSelector('[data-block]').click().end()


      .findDisplayedByCssSelector('#sidebar .loader').end()
        .fill('Block label', label)
        .fill('CSS class', css_class)
        .fill('CSS ID', css_id)
        .select('Heading level', 'h2')
        .end()

      .waitForAjax()

      .then(function(e) {
        return this.parent
          .findByCssSelector('.block-header .name').assertText(label)

      })

      .refresh()
        .findByCssSelector('[data-block]').click().end()
        .waitForAjax()
        .findDisplayedByCssSelector('#sidebar')
        .assertValue('Block label', label)
        .assertValue('CSS class', css_class)
        .assertValue('CSS ID', css_id)


    },



    'move': function() {
      var zone_right, zone_right_pos;
      return page
        .navigateTo('#layout/3/edit')
        .findDisplayedByCssSelector('[data-block]')
        .findByCssSelector('.block-header')
        .moveMouseTo()
        .pressMouseButton(0)
        .sleep(100)
        .end()
        .end()

      .findByCssSelector('[data-zone="right"]')
        .then(function(element) {
          zone_right = element;
        })
        .end()
        .moveMouseTo(0, 0)
        .sleep(100)
        .then(function() {
          this.moveMouseTo(zone_right)
        })
        .sleep(500)
        .releaseMouseButton(0)

    },


    'destroy': function() {
      var block;
      return page
        .navigateTo('#layout/3/edit')
        .findDisplayedByCssSelector('[data-block]')
        .then(function(el) {
          block = el;
        })
        .findByCssSelector('.block-header')
        .moveMouseTo()
        .sleep(100)
        .findByClassName('js-destroy')
        .click().end()
        .end()
        .end()
        .sleep(500)
        .findByCssSelector('.modal .action_apply').click().end()
        .waitForAjax()
        .then(function() {
          block.isDisplayed().then(function(res) {
            assert.fail(res, 'Element should be destroyed');
          })
        })
    }

  });


});

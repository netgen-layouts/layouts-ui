define(function (require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');

registerSuite({
    name: 'layout base',

    'rename layout': function () {
      return this.remote
        .get(require.toUrl('#layout/1/edit'))
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
            .then(function (text) {
              assert.strictEqual(text, 'New layout')
            });
    }

  });

  registerSuite({
    name: 'layout - draft / published',

    'show dialog when draft exists': function() {
      return this.remote
        .get(require.toUrl('#layout/1'))
        .findDisplayedByCssSelector('.modal')
          .findByCssSelector('.modal-title')
            .getVisibleText()
            .then(function (text) {
              assert.strictEqual(text, 'What would you like to do with the draft?')
            })

    },


    'edit_existing': function() {
      return this.remote
        .findByCssSelector('.modal .action_cancel')
          .click()
          .end()
        .waitForDeletedByCssSelector('.modal')
        .findAllByCssSelector('[data-block]')
        .then(function(elements){
          assert(elements.length);
        })
    },



    'discard current draft and create new': function() {
      var base_updated_at;

      return this.remote
        .get(require.toUrl('#layout/1'))
        .execute('return Core.g.layout.get("updated_at")')
        .then(function(result){
          base_updated_at = result;
        })
        .findDisplayedByCssSelector('.modal')
          .findByCssSelector('.action_apply')
            .click()
            .end()
        .end()
        .waitForDeletedByCssSelector('[data-block]')
        .getCurrentUrl()
        .then(function(result){
          assert.equal(result, 'http://bm.site/bm/dev/app/#layout/1/edit')
        })
        .execute('return Core.g.layout.get("updated_at")')
        .then(function(result){
          var diff = new Date(result) - new Date(base_updated_at);
          assert.isAbove(diff, 0, 'Layout is not recently updated');
        })
        .findAllByCssSelector('[data-block]')
        .then(function(elements){
          assert(elements.length);
        })
        .end()
        .findByCssSelector('.app-center .js-show-form')
          .getVisibleText()
          .then(function (text) {
            assert.strictEqual(text, 'My layout')
          });


    },



  });


  registerSuite({
    name: 'layout - block move',
    'move block': function(){
      var zone_right, zone_right_pos;
      return this.remote
        .setFindTimeout(5000)
        .maximizeWindow()
        .get('http://bm.site/bm/dev/app/#layout/1/edit')
          .findDisplayedByCssSelector('[data-block]')
            .findByCssSelector('.block-header')
              .moveMouseTo()
              .pressMouseButton(0)
              .sleep(100)
              .end()
            .end()

          .findByCssSelector('[data-zone="right"]')
            .then(function(element){
              zone_right = element;
            })
            .end()
          .moveMouseTo(0, 0)
          .sleep(100)
          .then(function(){
            this.moveMouseTo(zone_right)
          })
          .sleep(500)
          .releaseMouseButton(0)

    },

    'add new block': function(){
      var zone_top;
      return this.remote
        .findByCssSelector('.left-toolbar-buttons')
          .findByCssSelector('.open-panel')
            .click()
            .end()
          .end()

        .findByCssSelector('[data-zone="top"]')
          .then(function(element){
            zone_top = element;
          })
          .end()

        .findByCssSelector('.panel-content .add-block-btn.title')
          .moveMouseTo()
          .pressMouseButton(0)
          .sleep(100)
          .then(function(){
            this.moveMouseTo(zone_top)
          })
          .sleep(100)
          .releaseMouseButton(0)
          .end()

        .findByCssSelector('[data-zone="top"] [data-block]')

    }
  });


});

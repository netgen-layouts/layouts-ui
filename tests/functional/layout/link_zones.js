define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Layout::Link',

    before: function() {
      page = new Page(this.remote);
      page
        .setFindTimeout(5000)
        .maximizeWindow()
    },

    beforeEach: function() {
      Page.clearStorage()
    },


    'enter link zone mode': function() {
      return page
        .navigateTo('#layout/1/edit')
        .clickOn('.js-layout-mapper', {visible: true})
        .count('.js-choose', {visible: true}).assert('equal', 2)
    },


    'choose a zone': function() {
      return page
        .clickOn('.js-choose', {visible: true})
        .assertCurrentUrl('#layout/3/link_zone/top/with_layout/1', 'include')
        .waitForAjax()
        .match('.app-center', {visible: true})
          .match('.form-inline').assertText('WITH', 'include').end()
          .count('select option').assert('equal', 2)
          .match('select option:first-child').assertText('My third layout').end()
        .end()
        .count('[data-block]').assert('equal', 0)
    },


    'list through the shared layouts': function() {
      return page
        .match('.app-center select').choose(5).end()
        .waitForAjax()
        .execute('return Core.g.layout.id;').assert('equal', 5)
        .match('.app-center select').choose(3).end()
        .waitForAjax()
        .execute('return Core.g.layout.id;').assert('equal', 3)
    },


    'link a zone': function() {
      return page
        .clickOn('.js-link')
        .waitForAjax()
        .assertCurrentUrl('#layout/1/edit', 'include')
        .waitForAjax()
        .match('[data-zone="top"]').getAttribute('class').assert('include', 'linked_zone')
    },


    'unlink a zone': function() {
      return page
        .clickOn('.js-layout-mapper', {visible: true})
        .count('.js-choose', {visible: true}).assert('equal', 2)
        .match('[data-zone="top"]')
          .match('.js-choose').end()
          .match('.js-unlink').end()
          // .match('.js-edit-parent').end() //no parent
          .clickOn('Unlink')
        .end()
        .inModal().clickOn('OK').end()
        .waitForAjax()
        .match('[data-zone="top"]')
          .getAttribute('class').assert('notInclude', 'linked_zone')
    },


    'cancel linking a zone': function() {
      return page
        .clickOn('.js-choose')
        .waitForAjax()
        .clickOn('Back').waitForAjax()
        .assertCurrentUrl('#layout/1/link', 'include')
        .clickOn('Back')
        .assertCurrentUrl('#layout/1/edit', 'include')
        .waitForAjax()
        .count('[data-block]').assert('equal', 3)
    },


    'only workflow states': function(){

      function assert_step1(res) {
        assert.include(res, 'EDIT LAYOUT')
        assert.include(res, 'Discard')
        assert.include(res, 'Publish layout')
      }


      function assert_step2(res) {
        assert.include(res, 'CHOOSE LAYOUT ZONE')
        assert.include(res, 'Back')
        assert.notInclude(res, 'Discard')
        assert.notInclude(res, 'Publish layout')
      }


      function assert_step3(res) {
        assert.include(res, 'LINK LAYOUT')
        assert.include(res, 'WITH')
        assert.include(res, 'Back')
        assert.notInclude(res, 'Discard')
        assert.notInclude(res, 'Publish layout')
      }

      return page
        .navigateTo('#layout/1/edit')

        //Step1 - Normal edit
        .match('.app-center').getVisibleText().then(assert_step1).end()
        .match('.blocks .js-open').getAttribute('class').assert('notInclude', 'active').end()
        .match('.js-layout-mapper').getAttribute('class').assert('notInclude', 'active').end()

        //Enter Step 2 - Layout mapper
        .clickOn('.js-layout-mapper', {visible: true})
        .match('.app-center').getVisibleText().then(assert_step2).end()
        .match('.blocks .js-open').getAttribute('class').assert('notInclude', 'disabled').end()
        .match('.js-layout-mapper').getAttribute('class').assert('include', 'active').end()

        //Enter Step 1
        .clickOn('.js-soft-back')
        .match('.app-center').getVisibleText().then(assert_step1).end()


        //Enter Step 2
        .clickOn('.js-layout-mapper', {visible: true})

        //Enter Step 3
        .clickOn('Choose a zone').waitForAjax()
        .match('.app-center').getVisibleText().then(assert_step3).end()
        .match('.blocks .js-open').getAttribute('class').assert('include', 'disable').end()
        .match('.js-layout-mapper').getAttribute('class').assert('include', 'active').end()

        //Enter Step 2
        .clickOn('.js-back').waitForAjax()
        .match('.app-center').getVisibleText().then(assert_step2).end()

        //Enter Step 1
        .clickOn('.js-soft-back').waitForAjax()
        .match('.app-center').getVisibleText().then(assert_step1).end()


        //Direct navigation
        .navigateTo('#layout/1/link')
        .match('.app-center').getVisibleText().then(assert_step2).end()
        .match('.blocks .js-open').getAttribute('class').assert('notInclude', 'disabled').end()
        .match('.js-layout-mapper').getAttribute('class').assert('include', 'active').end()

        .navigateTo('#layout/3/link_zone/top/with_layout/1')
        .match('.app-center').getVisibleText().then(assert_step3).end()
        .match('.blocks .js-open').getAttribute('class').assert('include', 'disable').end()
        .match('.js-layout-mapper').getAttribute('class').assert('include', 'active').end()


      },








  });



});

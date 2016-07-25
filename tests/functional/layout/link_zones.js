define(function(require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');
  var Page = require('../../support/page');
  var utils = Page.utils;

  var page;

  registerSuite({
    name: 'Link zone',

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
        .waitForAjax()
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
          .match('.js-edit-parent').end()
          .clickOn('.js-unlink')
        .end()
        .clickOn('.modal .action_apply', {visible: true})
        .waitForAjax()
        .match('[data-zone="top"]')
          .getAttribute('class').assert('notInclude', 'linked_zone')
    },


    'cancel linking a zone': function() {
      return page
        .clickOn('.js-choose')
        .waitForAjax()
        .clickOn('.app-center .js-normal-mode')
        .assertCurrentUrl('#layout/1/edit', 'include')
        .waitForAjax()
        .count('[data-block]').assert('equal', 3)
    },








  });



});

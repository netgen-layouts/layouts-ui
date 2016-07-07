define(function (require) {
  var registerSuite = require('intern!object');
  var assert = require('intern/chai!assert');

  registerSuite({
    name: 'index',

    'rename layout': function () {
      return this.remote
        .get(require.toUrl('bm/dev/app/#layout/1/edit'))
        .setFindTimeout(5000)
        .findByCssSelector('.layout-name')
          .click()
          .end()
        .findByCssSelector('.js-name')
          .clearValue()
          .type('New layout')
          .end()
        .findByCssSelector('.layout-name  .btn-primary')
          .click()
          .end()
        .findByCssSelector('.js-show-form')
          .getVisibleText()
          .then(function (text) {
            assert.strictEqual(text, 'New layout')
          });
    }

  });
});

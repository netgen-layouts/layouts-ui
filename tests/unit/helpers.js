define(function (require) {
  var registerSuite = require('intern!object');
  var helpers = require('intern/dojo/node!../../app/scripts/lib/handlebars/helpers.js')
  var assert = require('intern/chai!assert');

  registerSuite({
    'date with_format': function() {
      var d = new Date();
      var f = helpers.date(d, {hash: {format: 'l'}});
      assert.strictEqual(f, [d.getMonth()+1, d.getDate(), d.getFullYear()].join('/'))
    }
  });
});

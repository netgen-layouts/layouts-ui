// in tests/support/pages/Page.js
define(function(require) {

  var Command = require('intern/dojo/node!leadfoot/Command');
  var Element = require('intern/dojo/node!leadfoot/Element');
  var pollUntil = require('intern/dojo/node!leadfoot/helpers/pollUntil');
  var assert = require('intern/chai!assert');


  // the page object is created as a constructor
  // so we can provide the remote Command object
  // at runtime
  function Page() {
    return Command.apply(this, arguments);
  }

  Page.utils = {
    stamped: function(name){
      var stamp = +new Date();
      return name + ' ' + stamp;
    }
  }

  Page.prototype = Object.create(Command.prototype)
  Page.prototype.constructor = Page;


  Page.prototype.waitForAjax = function() {
      return new this.constructor(this, function(setContext) {
        var parentContext = this._context;

        return this.parent
          .then(pollUntil('return $.active === 0 || null;', 5000, 250))
          .then(function() {
            setContext(parentContext)
            return parentContext;
          })
      })
    },


  Page.prototype.navigateTo = function(url) {
      return new this.constructor(this, function(setContext) {
        var parentContext = this._context;

        return this.parent.get(require.toUrl(url))
      })
    },

    Page.prototype.findByLabel = function(input_name) {
      return new this.constructor(this, function(setFinalContext) {

        return this.parent
          .findDisplayedByXpath('//LABEL[normalize-space(string())="' + input_name + '"]')
          .getAttribute('for')
          .then(function(id, setContext) {
            return this.parent
              .end()
              .findById(id)
              .then(function(element) {
                setFinalContext(element);
                return element;
              })
          })
      })
    }


  Page.prototype.fill = function(input_name, value) {
    return new this.constructor(this, function() {
      return this.parent
        .findByLabel(input_name)
        .clearValue()
        .type(value)
    })
  }


  Page.prototype.select = function(input_name, value) {
    return new this.constructor(this, function() {
      return this.parent
        .findByLabel(input_name)
        .findByCssSelector('option[value="'+value+'"]')
        .click(value)
    })
  }



  Page.prototype.assertValue = function(input_name, expected) {
    return new this.constructor(this, function() {
      return this.parent
        .findByLabel(input_name)
        .getAttribute('value')
        .then(function(real){
          assert.strictEqual(real, expected)
        })

    })
  }


  Page.prototype.assertText = function(expected, method) {
    method || (method = 'strictEqual');
    return new this.constructor(this, function() {
      return this.parent
        .getVisibleText()
        .then(function(real){
          assert[method](real, expected)
        })

    })
  }





  return Page;
});

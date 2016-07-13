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


  Page.storage = {};
  Page.clearStorage = function() {
    this.storage = {};
    return this.storage;
  }

  Page.utils = {
    stamped: function(name) {
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
  }


  Page.prototype.navigateTo = function(url) {
    return new this.constructor(this, function(setContext) {
      var parentContext = this._context;

      return this.parent.get(require.toUrl(url))
    })
  }


  Page.prototype.match = function(selector, opts) {
    opts || (opts = {});
    var findMethod = opts.visible ? 'findDisplayed' : 'find'
    findMethod = opts.all ? 'findAll' : findMethod
    return new this.constructor(this, function(setContext) {
      return this.parent[findMethod](opts.strategy || 'css selector', selector).then(function(element) {
        setContext(element)
        return element;
      })
    })
  }


  Page.prototype.clickOn = function(selector, opts) {
    return new this.constructor(this, function(setContext) {
      return this.parent.match(selector, opts).click().end()
    })
  }



  Page.prototype.store = function(name) {
    return new this.constructor(this, function(setContext) {
      this.then(function(result) {
        Page.storage[name] = result
      })
      return this.parent;
    })
  }




  Page.prototype.drag = function(selector, opts) {
    return new this.constructor(this, function(setContext) {
      return this.parent
        .match(selector, opts)
        .moveMouseTo()
        .pressMouseButton(0)
        .sleep(100)
    }).end()
  }


  Page.prototype.dropTo = function(selector, opts) {
    return new this.constructor(this, function(setContext) {
      return this.parent
        .match(selector, opts)
        .moveMouseTo()
        .releaseMouseButton(0)
        .sleep(100)
    }).end()
  }




  Page.prototype.count = function(selector, opts) {
    return new this.constructor(this, function(setContext) {
      return this.parent.match(selector, opts).then(function(elements) {
          return elements.length;
        })
    })
  }



  Page.prototype.read = function(name) {
    return Page.storage[name]
  }


  Page.prototype.fetch = function(name) {
    return new this.constructor(this, function(setContext) {
      return this.parent.then(function() {
        return Page.storage[name]
      })
    })
  }



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


  Page.prototype.select = Page.prototype.input = Page.prototype.findByLabel;

  Page.prototype.fill = function(value) {
    return new this.constructor(this, function() {
      return this.parent
        .clearValue()
        .type(value)
    }).end()
  }





  Page.prototype.choose = function(value) {
    return new this.constructor(this, function() {
      return this.parent
        .findByCssSelector('option[value="' + value + '"]')
        .click(value)
    }).end()
  }



  Page.prototype.assertValue = function(input_name, expected) {
    return new this.constructor(this, function() {
      return this.parent
        .findByLabel(input_name)
        .getAttribute('value')
        .then(function(real) {
          assert.strictEqual(real, expected)
        })

    })
  }


  Page.prototype.assertCurrentUrl = function(expected, method) {
    return new this.constructor(this, function() {
      return this.parent
        .getCurrentUrl()
        .then(function(real) {
          assert[method || 'equal'](real, expected)
        })
    })
  }



  Page.prototype.assertText = function(expected, method) {
    method || (method = 'strictEqual');
    return new this.constructor(this, function() {
      return this.parent
        .getVisibleText()
        .then(function(real) {
          assert[method](real, expected)
        })

    })
  }




  return Page;
});

'use strict';

var Core = require('../core');
var Block = require('../models/blocks/block');
var _ = require('underscore');

module.exports = Core.Collection.extend({
  model: Block,
  destroy_all: function(){
    var length = this.length;
    while (this.models[0]) {
      this.models[0].destroy();
    }
    return length;
  }


});

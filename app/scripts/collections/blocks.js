'use strict';

var Core = require('core_boot');
var Block = require('../models/blocks/block');

module.exports = Core.Collection.extend({
  model: Block
});

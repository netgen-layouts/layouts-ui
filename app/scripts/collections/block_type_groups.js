'use strict';

var Core = require('netgen-core');
var BlockTypeGroup = require('../models/block_type_group');

module.exports = Core.Collection.extend({
  model: BlockTypeGroup,
  name: 'BlockTypeGroups'
});

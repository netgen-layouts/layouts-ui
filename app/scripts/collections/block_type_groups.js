'use strict';

var Core = require('core_boot');
var BlockTypeGroup = require('../models/block_type_group');

module.exports = Core.Collection.extend({
  model: BlockTypeGroup,
  name: 'BlockTypeGroups'
});

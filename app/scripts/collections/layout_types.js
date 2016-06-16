'use strict';

var Core = require('core_boot');
var LayoutType = require('../models/layout_type');

module.exports = Core.Collection.extend({
  cached: true,
  model: LayoutType,
  name: 'LayoutTypes'
});

'use strict';

var Core = require('core_boot');
var LayoutType = require('../models/layout_type');

module.exports = Core.Collection.extend({
  model: LayoutType,
  name: 'LayoutTypes'
});

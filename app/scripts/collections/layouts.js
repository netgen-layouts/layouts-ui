'use strict';

var Core = require('core_boot');
var Layout = require('../models/layout');

module.exports = Core.Collection.extend({
  cached: true,
  model: Layout
});

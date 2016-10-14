'use strict';

var Core = require('netgen-core');
var Layout = require('../models/layout');

module.exports = Core.Collection.extend({
  model: Layout
});

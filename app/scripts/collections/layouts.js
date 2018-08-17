'use strict';

var Core = require('@netgen/layouts-ui-core');
var Layout = require('../models/layout');

module.exports = Core.Collection.extend({
  model: Layout
});

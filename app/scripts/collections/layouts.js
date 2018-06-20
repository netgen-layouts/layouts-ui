'use strict';

var Core = require('@netgen/layouts-core-ui');
var Layout = require('../models/layout');

module.exports = Core.Collection.extend({
  model: Layout
});

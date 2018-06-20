'use strict';

var Core = require('@netgen/layouts-core-ui');
var LayoutType = require('../models/layout_type');

module.exports = Core.Collection.extend({
  model: LayoutType,
  name: 'LayoutTypes'
});

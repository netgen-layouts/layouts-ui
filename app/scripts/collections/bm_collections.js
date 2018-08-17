'use strict';

var Core = require('@netgen/layouts-ui-core');
var BmCollection = require('../models/bm_collection');

module.exports = Core.Collection.extend({
  model: BmCollection
});

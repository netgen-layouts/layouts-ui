'use strict';

var Core = require('@netgen/layouts-core-ui');
var BmCollection = require('../models/bm_collection');

module.exports = Core.Collection.extend({
  model: BmCollection
});

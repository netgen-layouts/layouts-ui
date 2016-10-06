'use strict';

var Core = require('netgen-core');
var BmCollection = require('../models/bm_collection');

module.exports = Core.Collection.extend({
  model: BmCollection
});

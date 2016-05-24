'use strict';

var Core = require('core_boot');
var BmCollection = require('../models/bm_collection');

module.exports = Core.Collection.extend({
  model: BmCollection
});

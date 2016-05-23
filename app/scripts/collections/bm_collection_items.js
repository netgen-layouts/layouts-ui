'use strict';

var Core = require('core_boot');
var BmCollectionItem = require('../models/bm_collection_item');

module.exports = Core.Collection.extend({
  model: BmCollectionItem
});

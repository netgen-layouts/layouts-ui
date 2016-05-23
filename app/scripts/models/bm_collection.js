'use strict';

var Core = require('core_boot');
var BmCollectionItems = require('../collections/bm_collection_items');

module.exports = Core.Model.extend({
  path: 'collections',

  idAttribute: 'collection_id',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('sync', this.setup_items);
    this.items = new BmCollectionItems();
    return this;
  },

  setup_items: function(){
    this.items.reset(this.attributes.items);
    return this;
  },


});

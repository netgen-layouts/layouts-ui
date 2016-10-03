'use strict';

var Core = require('core');

module.exports = Core.Model.extend({
  path: 'collections/items',

  paths: {
    create: 'collections/:collection_id/items'
  },

  can_remove_item: function(){
    return this.get('type') !== 2 && !this.collection.bm_collection.get('collection_shared');
  },

  is_manual: function(){
    return this.get('type') === 0
  },

});

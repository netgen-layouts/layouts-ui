'use strict';

var Core = require('core');
var BmCollectionItem = require('../models/bm_collection_item');

module.exports = Core.Collection.extend({
  model: BmCollectionItem,

  sync_create_items: function(items){

    var data = {
      items: items
    };

    return this.sync('create', this, {
      contentType: 'application/json',
      data: JSON.stringify(data),
      url: this.url('create', {collection_id: this.bm_collection.get('collection_id') })
    });

  },


});

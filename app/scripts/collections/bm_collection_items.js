'use strict';

var Core = require('core_boot');
var BmCollectionItem = require('../models/bm_collection_item');

module.exports = Core.Collection.extend({
  model: BmCollectionItem,


  create_url: function(){
    return Core.env.base_url + 'collections/' + this.bm_collection.id + '/items';
  },


  sync_create_items: function(items){

    var data = {
      items: items
    };

    return this.sync('create', this, {
      via: 'create',
      contentType: 'application/json',
      data: JSON.stringify(data),
      url: this.create_url('items')
    });

  },


});

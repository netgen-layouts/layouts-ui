'use strict';

var Core = require('core_boot');
var BmCollectionItems = require('../collections/bm_collection_items');

module.exports = Core.Model.extend({
  path: 'collections',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('sync', this.setup_items);
    this.items = new BmCollectionItems();
    this.items.bm_collection = this;
    return this;
  },

  can_add_items: function(){
    return this.get('type') !== 2;
  },

  setup_items: function(){
    console.log('setup items');
    this.items.reset(this.attributes.items);
    return this;
  },

  fetch_results: function(){
    return this.fetch({via: 'result', data: {offset: this.get('offset'), limit: this.get('limit')} });
  },


  sync_add_items: function(items){
    var data = {
      items: items
    };
    return this.save(data, {
      via: 'add_items',
      url: this.url('items'),
      method: 'POST',
      patch: true
    });
  }


});

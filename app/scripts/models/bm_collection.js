'use strict';

var Core = require('netgen-core');
var BmCollectionItems = require('../collections/bm_collection_items');

module.exports = Core.Model.extend({
  path: ':locale/collections',
  paths: {
    change_type: ':locale/blocks/:block_id/collections/:id/change_type',
    results:     ':locale/blocks/:block_id/collections/:id/result',
    remove_all_items: 'collections/:collection_id/items',
  },

  locale: function(){
    return this.block().locale();
  },

  idAttribute: 'identifier',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('sync', this.setup_items);
    this.on('change_type:success', this.proxy_to_block);
    this.items = new BmCollectionItems();
    this.items.bm_collection = this;
    return this;
  },


  proxy_to_block: function(){
    this.block().trigger('change_type:success');
  },


  setup_items: function(){
    var overflown = this.attributes.overflow_items.map(function(item){
      item.overflown = true;
      return item;
    });
    this.items.reset(this.attributes.items.concat(overflown));
    return this;
  },

  fetch_results: function(){
    return this.fetch({
      via: 'result',
      url: this.url('results')
    });
  },


  sync_add_items: function(items){
    var data = {
      items: items
    };
    return this.save(data, {
      via: 'items',
      method: 'POST',
      patch: true
    });
  },

  sync_change_type: function(data){
    return this.save(data, {
      via: 'change_type',
      method: 'POST',
      patch: true
    });
  },

  remove_all_items: function(){
    return this.save(null, {
      via: 'delete_all',
      method: 'DELETE',
      url: this.url('remove_all_items'),
    });
  },


  block: function(){
    return Core.g.layout.blocks.get(this.get('block_id'));
  },

  show_remove_all: function(){
    return this.items.reduce(function(total, item) {
      if (item.is_manual()) total++;
      return total;
    }, 0) >= 10;
  },

});

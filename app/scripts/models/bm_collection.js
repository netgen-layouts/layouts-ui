'use strict';

var Core = require('netgen-core');
var BmCollectionItems = require('../collections/bm_collection_items');

module.exports = Core.Model.extend({
  path: ':locale/collections',
  paths: {
    change_type: ':locale/blocks/:block_id/collections/:id/change_type',
    results:     ':locale/blocks/:block_id/collections/:id/result'
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
    this.items.reset(this.attributes.items);
    return this;
  },

  fetch_results: function(){
    return this.fetch({
      via: 'result',
      url: this.url('results'),
      data: {offset: this.get('offset'), limit: this.get('limit')}
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


  block: function(){
    return Core.g.layout.blocks.get(this.get('block_id'));
  },


});

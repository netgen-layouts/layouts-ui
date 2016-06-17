'use strict';

var Core = require('core_boot');
var BmCollectionItems = require('../collections/bm_collection_items');

module.exports = Core.Model.extend({
  path: 'collections',

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

  change_type_url: function(){
    return  Core.env.base_url + 'blocks/' + this.get('block_id') + '/collections/'+this.get('identifier')+'/change_type';
  },

  results_url: function(){
    return  Core.env.base_url + 'blocks/' + this.get('block_id') + '/collections/'+this.get('identifier')+'/result';
  },

  can_add_items: function(){
    return this.get('type') !== 2;
  },

  setup_items: function(){
    this.items.reset(this.attributes.items);
    return this;
  },

  fetch_results: function(){
    return this.fetch({
      via: 'result',
      url: this.results_url(),
      data: {offset: this.get('offset'), limit: this.get('limit')}
    });
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
  },

  sync_change_type: function(data){
    data.new_type && (data.new_type = parseInt(data.new_type, 10));
    data.named_collection_id && (data.named_collection_id = parseInt(data.named_collection_id, 10));

    return this.save(data,{
      via: 'change_type',
      url: this.change_type_url(),
      method: 'POST',
      patch: true
    });
  },


  block: function(){
    return Core.g.layout.blocks.get(this.get('block_id'));
  },


});

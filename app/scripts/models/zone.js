'use strict';

var Core = require('netgen-core');
var Blocks = require('../collections/blocks');
var _ = require('underscore');

module.exports = Core.Model.extend({
  class_name: 'zone',

  idAttribute: 'identifier',

  paths: {
    link: 'layouts/:layout_id/zones/:identifier/link'
  },


  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('unlink:success', this.clear_linked);
    return this;
  },


  on_load_blocks_in_zone: function(response){
    console.log(response);
    // var block_ids = this.get('block_ids');
    // block_ids.push()
    // this.set('block_ids', this.get )
    return this;
  },

  is_inherited: function(){
    return !!this.get('linked_zone_identifier')
  },

  is_linked: function() {
    return this.is_inherited()
  },

  has_blocks: function() {
    return this.get('block_ids').length;
  },

  is_empty: function() {
    return !this.has_blocks();
  },


  add_block: function(id) {
    this.set({block_ids: _.union(this.get('block_ids'), [id]) });
  },

  remove_block: function(id) {
    this.set({block_ids: _.without(this.get('block_ids'), id) });
  },

  blocks: function(){
    var blocks = Core.g.layout.blocks;
    return this.get('linked_layout_id') ? blocks.get_by_ids(this.get('linked_blocks_ids')) : blocks.get_by_ids(this.get('block_ids'))
  },

  layout: function(){
    return Core.g.layout;
  },

  should_accept: function(type_or_block){
    var allowed = this.get('allowed_block_definitions');
    if(allowed){ return true; }
    var id = type_or_block.get('identifier') || type_or_block.id;
    return _.contains(allowed, id);
  },


  linked_layout: function(){
    return Core.g.shared_layouts.get(this.get('linked_layout_id'));
  },


  // linked_zone_name: function(){
  //   return this.linked_layout().zones.get(this.get('linked_zone_identifier'));
  // },


  clear_linked: function(){
    this.set({
      linked_layout_id: null,
      linked_zone_identifier: null
    })
    return this;
  },

  sync_link: function(data){
    return this.save(data, {
      via: 'link',
      method: 'POST',
      patch: true
    })
  },


  sync_unlink: function(){
    return this.save({}, {
      via: 'unlink',
      url: this.url('link'),
      method: 'DELETE',
      patch: true
    })
  },

  link_with_zone: function(zone){
    return this.sync_link({
      linked_layout_id: zone.get('layout_id'),
      linked_zone_identifier: zone.get('id')
    })
  },


  load_blocks: function(opts){
    var blocks = Core.g.layout.blocks;
    return blocks.fetch({
      via: 'blocks_in_zone',
      url: blocks.model.prototype.url('blocks_in_zone', {layout_id: this.get('linked_layout_id'), zone_identifier: this.get('linked_zone_identifier')}),
      data: opts.data,
      remove: false
    }).done(function(resp){
      this.set({ linked_blocks_ids: _.pluck(resp, 'id') });
    }.bind(this))
  },

});

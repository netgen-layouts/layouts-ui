'use strict';

var Core = require('core_boot');
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
    return Core.g.layout.blocks.get_by_ids(this.get('block_ids'));
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
  }

});

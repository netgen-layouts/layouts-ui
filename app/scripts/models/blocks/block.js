'use strict';

var Core = require('../../core');
var Env = require('../../environments/default');
var BmModel = require('../model');
var BmCollections = require('../../collections/bm_collections');

module.exports = BmModel.extend({
  class_name: 'block',

  format : '',

  path: ':locale/blocks',
  paths: {
    blocks_in_zone: ':locale/layouts/:layout_id/zones/:zone_identifier/blocks'
  },

  locale: function(){
    return this.layout().get('locale');
  },

  initialize: function(attributes){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('create:success', this.add_to_blocks_collection);
    this.on('destroy', this.on_destroy);
    this.on('sync', this.setup_bm_collections);
    this.bm_collections = new BmCollections();
    this.setup_bm_collections();
    return this;
  },


  setup_bm_collections: function(){
    var items = (this.attributes.collections || []).map(function(item){
      item.block_id = this.get('id');
      return item
    }.bind(this));
    this.bm_collections.set(items, {parse: true});
    //delete(this.attributes.collections);
  },


  on_destroy: function(){
    this.zone().remove_block(this.get('id'));
    return this;
  },


  edit_url: function(){
    return Env.bm_app_url(this.get('locale')+'/blocks/'+this.id+'/edit');
  },

  add_to_blocks_collection: function(){
    Core.g.layout.get('blocks').add(this);
    this.zone().add_block(this.get('id'));
  },


  remove_block_from_zone: function(){
    return this;
  },

  definition: function(){
    return Core.g.block_types.get(this.get('definition_identifier'));
  },

  // template_name: function(){
  //   return this.get('view_type');
  // },

  param: function(){
    return this.get('parameters');
  },

  is_group: function(){
    return this.kind_of('Group');
  },

  is_container: function(){
    return this.attributes.is_container;
  },

  is_in_container: function(){
    return this.get('container_id');
  },

  is_image: function(){
    return this.kind_of('Image');
  },

  kind_of: function(kind){
    return this.get('definition_identifier') === kind;
  },

  // //FIXME
  // belongs_to_current_layout: function(){
  //   return Core.g.layout.id === this.get('layout_id');
  // },


  default_bm_collection: function(){
    return this.bm_collections.findWhere({identifier: 'default'});
  },


  zone: function(){
    return Core.g.layout.zones.get(this.get('zone_identifier'));
  },

  layout: function() {
    return this.zone().layout();
  },

  container: function(){
    return this.collection.get(this.get('parent_block_id'));
  },


  update_zone_blocks: function(prev_zone_id, new_zone_id){
    var prev_zone = Core.g.layout.zones.get(prev_zone_id);
    var new_zone = Core.g.layout.zones.get(new_zone_id);
    var id = this.get('id');
    prev_zone.remove_block(id);
    new_zone.add_block(id);

    return this;
  },

  copy: function(in_container) {
    var new_block = this.clone();
    var new_position = this.get('parent_position') + 1;
    return new_block.save({
      parent_position: new_position,
    }, {
      url: this.url(in_container ? 'copy' : 'copy/zone'),
      via: 'copy',
      method: 'POST',
      silent: true,
    }).done(function(resp) {
      resp.zone_identifier = this.get('zone_identifier');
      resp.layout_id = this.get('layout_id');
      this.trigger('copy:success', resp);
    }.bind(this));
  },


  move: function(zone_block_ids){
    var attributes = Core._.pick(this.attributes, 'zone_identifier', 'parent_position', 'layout_id');
    var previous_zone = this._previousAttributes.zone_identifier;
    return this.save(attributes, {
      url: this.url('move/zone'),
      via: 'move',
      method: 'POST',
      patch: true
    }).done(function() {
      this.update_zone_blocks(previous_zone, attributes.zone_identifier);
      this.zone().set('block_ids', zone_block_ids);
    }.bind(this));
  },


  move_to_container: function(zone_block_ids, container_block_ids){
    var attributes = Core._.pick(this.attributes, 'zone_identifier', 'parent_position', 'layout_id', 'parent_block_id', 'parent_placeholder');
    var previous_zone = this._previousAttributes.zone_identifier;
    return this.save(attributes, {
      url: this.url('move'),
      via: 'move',
      method: 'POST',
      patch: true
    }).done(function() {
      this.update_zone_blocks(previous_zone, attributes.zone_identifier);
      this.zone().set('block_ids', zone_block_ids);
    }.bind(this));
  },

  restore: function(){
    return this.save(null, {
      via: 'restore',
      method: 'POST',
      patch: true
    });
  }

});

'use strict';

var Core = require('../core');
var BmModel = require('./model');
var Blocks = require('../collections/blocks');
var _ = require('underscore');

module.exports = BmModel.extend({
  class_name: 'zone',

  idAttribute: 'identifier',

  paths: {
    link: 'layouts/:layout_id/zones/:identifier/link',
    blocks_in_zone: ':linked_layout_locale/layouts/:linked_layout_id/zones/:linked_zone_identifier/blocks'
  },


  linked_layout_locale: function () {
    var locale = this.layout().get('locale');
    console.log(locale);

    if(!this.linked_layout()){
      return locale;
    }

    if (this.linked_layout().has_locale(locale)){
      return locale;
    }else{
      return this.linked_layout().get('main_locale')
    };
  },

  locale: function(){
    return this.layout().get('locale');
  },


  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.children = [];
    this.on('unlink:success', this.clear_linked);
    return this;
  },



  contains_linked_zone: function() {
    return _.find(this.children, function(zone){
      zode.is_linked()
    });
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
    var blocks = this.layout().blocks;
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


  linked_zone_name: function(){
    return this.linked_layout().zones.get(this.get('linked_zone_identifier')).get('name');
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
  },


  // Load blocks of linked zones
  load_blocks: function(opts){
    var blocks = this.layout().blocks;
    return blocks.fetch({
      via: 'blocks_in_zone',
      url: this.url('blocks_in_zone'),
      data: opts.data,
      remove: false
    }).done(function(resp){
      this.set({linked_blocks_ids: _.pluck(resp, 'id') });
    }.bind(this))
  },


  set_zone_attributes_on_blocks: function(){
    _.each(this.blocks(), function(block){
      console.log('set_zone_attributes_on_blocks',  block);
      block.set({
        zone_identifier: this.id,
        layout_id: this.get('layout_id')
      });
    }, this);
  },

});

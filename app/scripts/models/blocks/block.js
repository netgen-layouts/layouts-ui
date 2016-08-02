'use strict';

var Core = require('core_boot');
var BmCollections = require('../../collections/bm_collections');

module.exports = Core.Model.extend({
  class_name: 'block',

  format : '',

  path: 'blocks',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('create:success', this.add_to_blocks_collection);
    this.on('destroy', this.on_destroy);
    this.bm_collections = new BmCollections();
    return this;
  },


  on_destroy: function(){
    this.zone().remove_block(this.get('id'));
    return this;
  },


  edit_url: function(){
    return Core.env.bm_app_url('blocks/'+this.id+'/edit');
  },

  add_to_blocks_collection: function(){
    Core.g.layout.get('blocks').add(this);
    this.zone().add_block(this.get('id'));
  },


  remove_block_from_zone: function(){
    console.log(this, arguments);
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
    return this.kind_of('Container');
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




  load_bm_collections: function(){
    return this.bm_collections.fetch({
      url: this.url('collections')
    });
  },

  default_bm_collection: function(){
    return this.bm_collections.findWhere({identifier: 'default'});
  },


  zone: function(){
    return Core.g.layout.zones.get(this.get('zone_identifier'));
  },


  update_zone_blocks: function(prev_zone_id, new_zone_id){
    console.log(arguments);
    var prev_zone = Core.g.layout.zones.get(prev_zone_id);
    var new_zone = Core.g.layout.zones.get(new_zone_id);

    var id = this.get('id');
    prev_zone.remove_block(id);
    new_zone.add_block(id);

    return this;
  },

  move: function(data){

    var attributes = Core._.pick(this.attributes, 'zone_identifier', 'position');
    var previous_zone = this._previousAttributes.zone_identifier;
    return this.save(attributes, {
      via: 'move',
      patch: true
    }).done(function() {
      this.update_zone_blocks(previous_zone, attributes.zone_identifier);
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

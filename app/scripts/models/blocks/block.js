'use strict';

var Core = require('core_boot');
var BmCollections = require('../../collections/bm_collections')

module.exports = Core.Model.extend({
  class_name: 'block',

  format : '',

  path: 'blocks',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('create:success', this.add_to_blocks_collection);
    this.bm_collections = new BmCollections();
    return this;
  },

  add_to_blocks_collection: function(){
    Core.g.layout.get('blocks').add(this);
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

  move: function(data){

    var items = Core._.pick(data, 'zone_identifier', 'position');

    var via = 'move';
    this.save(items, {
      via: via,
      url: this.url(via),
      patch: true
    });
  }

});

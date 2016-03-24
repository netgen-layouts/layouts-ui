'use strict';

var Core = require('core_boot');

module.exports = Core.Model.extend({

  format : '',

  path: 'blocks',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.on('create:success', this.add_to_blocks_collection);
    return this;
  },

  add_to_blocks_collection: function(){
    Core.g.layout.get('blocks').add(this);
  },

  type: function(){
    if(this.get('definition_identifier')){
      return Core.g.block_types.get(this.get('definition_identifier'));
    }else{
      return Core.g.block_types.get(this.get('identifier'));
    }
  },

  type_name: function(){
    return this.type().get('defaults').definition_identifier;
  },

  template_name: function(){
    return this.type().get('defaults').view_type;
  },

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
    return this.type_name() === kind;
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

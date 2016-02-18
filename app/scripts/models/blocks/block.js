define(['underscore', 'model', 'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format : '',

    path: 'blocks',

    initialize: function(){
      Model.prototype.initialize.apply(this, arguments);
      this.on('create:success', this.add_to_blocks_collection);
      return this;
    },

    add_to_blocks_collection: function(){
      App.g.layout.get('blocks').add(this);
    },

    type: function(){
      if(this.get('definition_identifier')){
        return App.g.block_types.get(this.get('definition_identifier'));
      }else{
        return App.g.block_types.get(this.get('identifier'));
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

      var items = _.pick(data, 'zone_identifier', 'position');

      var via = 'move';
      this.save(items, {
        via: via,
        url: this.url(via),
        patch: true
      });
    }

  });

});

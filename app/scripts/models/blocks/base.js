define(['underscore', 'model', 'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format: 'json',

    initialize: function(){
      Model.prototype.initialize.apply(this, arguments);
      this.on('create:success', this.add_to_blocks_collection);
      return this;
    },

    add_to_blocks_collection: function(){
     App.g.layout.get('blocks').add(this);
    },

    path: function(){
      return this.get('endpoint');
    },

    block_type: function(){
      return App.g.block_templates.get(this.get('block_type_id'));
    },

    template_name_from_params: function(){
      return this.block_type().get('parameters').template;
    },

    template_name: function(){
      if(this.get('data') === false || (this.get('parameters') && this.get('parameters').data === false)) { return 'dummy'; }
      if((this.get('data') === true || (this.get('parameters') && this.get('parameters').data)) && !this.get('template')) { return 'normal'; }
      return this.get('template');
    },

    type_name: function(){
      return this.block_type().get('kind');
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
      return this.block_type().get('kind') === kind;
    },

    get_namespace: function(){
      var path = _.result(this, 'path');
      return path.substring(0, path.length-1);
    },

    toJSON: function(options) {
      var namespace = this.get_namespace(),
          attrs = {};

      attrs[namespace] = Model.prototype.toJSON.apply(this, arguments);
      return attrs;
    }

  });

});

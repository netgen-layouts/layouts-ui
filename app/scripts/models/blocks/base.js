define(['underscore', 'model', 'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format: 'json',

    path: function(){
      return this.get('endpoint');
    },

    type: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    template: function(){
      return this.type();
    },

    template_name_from_params: function(){
      return this.type().get('parameters').template;
    },

    template_name: function(){
      if(this.get('data') === false) { return 'dummy'; }
      return this.attributes.template;
    },

    type_name: function(){
      return this.type().get('type');
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

    kind_of: function(kind){
      return this.type().get('kind') === kind;
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }

  });

});

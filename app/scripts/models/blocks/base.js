define(['underscore', 'model', 'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format: 'json',

    initialize: function(){
      Model.prototype.initialize.apply(this, arguments);
      return this;
    },

    type: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    template: function(){
      return this.type();
    },

    template_name: function(){
      return this.type().get('parameters').template;
    },

    type_name: function(){
      return this.type().get('type');
    },

    is_group: function(){
      return this.kind_of('Group');
    },

    is_section: function(){
      return this.kind_of('Section');
    },

    is_in_section: function(){
      return this.get('section_id');
    },

    kind_of: function(kind){
      return this.type().get('kind') === kind;
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }


  });

});

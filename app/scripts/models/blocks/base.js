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
      return this.type().get('kind') === 'Group';
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }


  });

});

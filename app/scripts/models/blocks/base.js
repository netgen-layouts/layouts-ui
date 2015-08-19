define(['underscore', 'model',  'app'], function(_, Model, App){
  'use strict';

  return Model.extend({

    format: 'json',

    initialize: function(){
      Model.prototype.initialize.apply(this, arguments);
      this.on('save:success', this.after_save);
      return this;
    },

    after_save: function(model){
      if(!model.group){return;}
      var p = JSON.parse(model.group.get('params') || '{}');
      p[model.get('label')] = model.id;
      model.group.save({params: JSON.stringify(p) });
      return this;
    },

    type: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    template: function(){
      return this.type();
    },

    type_name: function(){
      return this.type().get('type');
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }


  });

});

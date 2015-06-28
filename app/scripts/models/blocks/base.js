define(['underscore', 'model',  'app'], function(_, Model, App){
  'use strict';

  return Model.extend({


    template: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }


  });

});

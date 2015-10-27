define(['underscore', 'model', './mixin/tree'], function(_, Model, MixinTree){
  'use strict';

  return Model
    .extend(MixinTree)
    .extend({

      format: 'json',
      path: 'nodes',

      parse: function(response) {
        this.initialize_children(response);
        return response;
      },

      initialize_children: function(response){
        if(!response.children){ return; }
        this.collection.add(response.children);
        delete(response.children);

      }
    });

});

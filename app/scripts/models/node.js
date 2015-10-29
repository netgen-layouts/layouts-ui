define(['model', './mixin/tree'], function(Model, MixinTree){
  'use strict';

  return Model
    .extend(MixinTree)
    .extend({

      format: 'json',
      path: 'nodes',

      has_children: function(){
        return this.get('children_size') > 0;
      },

      parse: function(response) {
        this.initialize_children(response);
        return response;
      },

      check: function(){
        this.selected_collection().add(this);
        return this;
      },

      uncheck: function(){
        this.selected_collection().remove(this);
        return this;
      },

      is_checked: function(){
        return this.selected_collection().get(this.id);
      },


      selected_collection: function(){
        return this.collection.browser.selected_collection;
      },

      initialize_children: function(response){
        console.log(response);
        if(!response.children){ return; }

        this.collection.add(response.children);
        delete(response.children);
      }
    });

});

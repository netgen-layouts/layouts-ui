define(['model', 'collections/items', 'collections/breadcrumbs'], function(Model, Items, Breadcrumbs){
  'use strict';

  return Model
    .extend({

      content_browser: true,

      name: function(){
        return 'default';
      },

      path: function(){
        return this.name() + '/config';
      },

      default_location: function(){
        var default_model = this.root_items.first();
        default_model.select();
        return default_model;
      },

      parse: function(response) {
        this.initialize_root_items(response);
        return response;
      },

      is_in_root_item: function(id){
        return this.root_items.some(function(item){ return item.id === id; });
      },

      initialize_root_items: function(response){
        if(!response.root_items){ return; }

        this.root_items = new Items();
        this.root_items.add(response.root_items);
        this.root_items.models.forEach(function(model){
          // we use this propery for list root item
          model.is_root_model = true;
          model.path = new Breadcrumbs([{
            id: model.id,
            name: model.get('name'),
            last: true
          }]);
        });
        delete(response.root_items);
      }

    });

});

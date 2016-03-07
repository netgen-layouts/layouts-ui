define(['model', 'collections/locations', 'collections/breadcrumbs'], function(Model, Locations, Breadcrumbs){
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
        var default_model = this.root_locations.first();
        default_model.select();
        return default_model;
      },

      parse: function(response) {
        this.initialize_root_locations(response);
        return response;
      },

      initialize_root_locations: function(response){
        if(!response.root_locations){ return; }

        this.root_locations = new Locations();
        this.root_locations.add(response.root_locations);
        this.root_locations.models.forEach(function(model){
          model.path = new Breadcrumbs([{
            id: model.id,
            name: model.get('name'),
            last: true
          }]);
        });
        delete(response.root_locations);
      }

    });

});

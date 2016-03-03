define(['model', 'collections/locations'], function(Model, Locations){
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
        delete(response.root_locations);
      }

    });

});

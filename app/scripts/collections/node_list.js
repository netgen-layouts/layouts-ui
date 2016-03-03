define(['app', 'collection', 'models/location'], function(App, Collection, Location){
  'use strict';

  return Collection.extend({
    model: Location,
    name: 'Locations'
  });

});

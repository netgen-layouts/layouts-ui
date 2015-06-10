define(['views/zones', 'collections/zones'], function(ViewZones, Zones){
  'use strict';

  var Compontent = new ViewZones({
    el: '.zones',
    collection: new Zones()
  });

  return Compontent;

});

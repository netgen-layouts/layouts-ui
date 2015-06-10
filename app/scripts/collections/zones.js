define(['collection', 'models/zone'], function(Collection, Zone){
  'use strict';

  return Collection.extend({
    model: Zone,
    url: 'data/zones.json'
  });

});

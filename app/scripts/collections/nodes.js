define(['app', 'collection', 'models/node'], function(App, Collection, Node){
  'use strict';

  return Collection.extend({
    model: Node,
    name: 'Nodes'
  });

});

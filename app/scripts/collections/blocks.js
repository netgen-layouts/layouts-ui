define(['collection', 'backbone',  'models/block'], function(Collection, Backbone, Block){
  'use strict';

  return Collection.extend({
    localStorage: new Backbone.LocalStorage('blocks'),
    model: Block,
    name: 'Blocks'
  });

});

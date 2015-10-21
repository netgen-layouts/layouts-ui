define(['collection', 'backbone',  'models/blocks/base'], function(Collection, Backbone, Block){
  'use strict';

  return Collection.extend({
    model: Block
  });

});

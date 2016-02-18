define(['collection', 'backbone',  'models/blocks/block'], function(Collection, Backbone, Block){
  'use strict';

  return Collection.extend({
    model: Block
  });

});

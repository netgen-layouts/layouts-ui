define(['collection', 'models/block'], function(Collection, Block){
  'use strict';

  return Collection.extend({
    url: 'data/blocks.json',
    model: Block
  });

});

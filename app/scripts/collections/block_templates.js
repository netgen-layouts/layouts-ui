define(['collection', 'models/block_template'], function(Collection, BlockTemplate){
  'use strict';

  return Collection.extend({
    url: 'http://localhost:3000/block_types.json',
    model: BlockTemplate
  });

});

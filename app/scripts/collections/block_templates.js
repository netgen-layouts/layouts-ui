define(['collection', 'models/block_template'], function(Collection, BlockTemplate){
  'use strict';

  return Collection.extend({
    url: 'data/block_types.json',
    model: BlockTemplate
  });

});

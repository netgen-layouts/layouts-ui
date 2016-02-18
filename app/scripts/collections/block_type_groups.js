define(['underscore', 'app', 'collection', 'models/block_type_group'], function(_, App, Collection, BlockTypeGroup){
  'use strict';

  return Collection.extend({
    cached: true,
    model: BlockTypeGroup,
    name: 'BlockTypeGroups'

  });

});

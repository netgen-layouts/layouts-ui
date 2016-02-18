define(['underscore', 'app', 'collection', 'models/block_type', './block_type_groups'], function(_, App, Collection, BlockType, BlockTypeGroups){
  'use strict';

  return Collection.extend({
    cached: true,
    model: BlockType,
    name: 'BlockTypes',

    parse: function(response){
      App.g.block_type_groups = new BlockTypeGroups(response.block_type_groups);
      return response.block_types;
    },

    by_group: function(){
      return this._by_group || (this._by_group = this.groupBy(function(item){return item.group_name();}));
    }

  });

});

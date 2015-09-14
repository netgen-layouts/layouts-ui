define(['underscore', 'app', 'collection', 'models/block_template'], function(_, App, Collection, BlockTemplate){
  'use strict';

  return Collection.extend({
    cached: true,
    model: BlockTemplate,

    url: function(){
      return App.env.base_url +  'block_types.json';
    },

    comparator: function(model) {
      return model.get('order');
    },

    by_group: function(){
      return this._by_group || (this._by_group = this.groupBy(function(item){return item.group_name();}));
    }

  });

});

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
      if(this._by_group){ return; }
      this._by_group = _.groupBy(this.models, function(item){return item.get('group');});
      return this._by_group;
    }

  });

});

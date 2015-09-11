define(['underscore', 'app', 'collection', 'models/block_template'], function(_, App, Collection, BlockTemplate){
  'use strict';

  return Collection.extend({
    cached: true,
    model: BlockTemplate,

    url: function(){
      return App.env.base_url +  'block_types.json';
    },

    by_group: function(){
      if(this._by_group){ return; }
      this._by_group = _.groupBy(this.models, function(item){return item.get('group');});
      return this._by_group;
    },

    /*by_group_and_order: function(){
      console.log(this._by_group_and_order);
      if(this._by_group_and_order) { return; }

      this._by_group_and_order = [];

      _.map(this.by_group(), function(items, id){
        console.log(id);
        this._by_group_and_order[id] = _.groupBy(items, function(item){return item.get('order');});
      }, this);

      return this._by_group_and_order;

    },*/

  });

});

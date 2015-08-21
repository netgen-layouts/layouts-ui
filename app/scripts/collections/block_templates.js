define(['app', 'collection', 'models/block_template'], function(App, Collection, BlockTemplate){
  'use strict';

  return Collection.extend({
    url: function(){
      return App.env.base_url +  'block_types.json';
    },
    model: BlockTemplate
  });

});

'use strict';

var Core = require('netgen-core');

module.exports = Core.Model.extend({
  path: 'collections/items',

  paths: {
    create: ':locale/blocks/:block_id/collections/:id/items'
  },

  locale: function(){

    return this;
  },

  can_remove_item: function(){
    return this.get('type') !== 2;
  },

  is_manual: function(){
    return this.get('type') === 0
  },

});

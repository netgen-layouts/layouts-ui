'use strict';

var Core = require('core_boot');

module.exports = Core.Model.extend({
  path: 'collections/items',

  can_remove_item: function(){
    return this.get('type') !== 2 && this.collection.bm_collection.get('type') !== 2;
  }

});

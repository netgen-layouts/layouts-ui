'use strict';

var Core = require('netgen-core');

module.exports = Core.Model.extend({
  path: 'collections/items',

  paths: {
    create: ':locale/blocks/:block_id/collections/:id/items'
  },

  can_remove_item: function(){
    return this.get('type') !== 2;
  },

  is_manual: function(){
    return this.get('type') === 0
  },

  is_visible: function(){
    return this.get('visible') && this.get('cms_visible');
  },

  has_menu: function(){
    return this.get('cms_url') || this.can_remove_item() || this.is_manual();
  },

});

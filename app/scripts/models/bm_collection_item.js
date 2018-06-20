'use strict';

var Core = require('@netgen/layouts-core-ui');

module.exports = Core.Model.extend({
  path: 'collections/items',

  paths: {
    create: ':locale/blocks/:block_id/collections/:id/items',
  },

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);

    this.get('override_item') && this.init_override_item();
    return this;
  },

  init_override_item: function(){
    this.overrideItem = new this.constructor(this.get('override_item'));
    this.overrideItem.set('position', this.get('position'));
  },

  can_remove_item: function(){
    return !this.get('is_dynamic');
  },

  is_manual: function(){
    return !this.get('is_dynamic');
  },

  is_visible: function(){
    return this.get('visible') && this.get('cms_visible');
  },

  has_menu: function(){
    return this.get('cms_url') || this.can_remove_item() || !this.get('is_dynamic');
  },

});

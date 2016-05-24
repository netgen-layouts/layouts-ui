'use strict';

var Core = require('core');
var _ = require('underscore');
var BmCollectionItemsView = require('./bm_collection_items');

module.exports = Core.View.extend({
  template: 'bm_collection',

  render: function(){
    Core.View.prototype.render.apply(this, arguments);

    new BmCollectionItemsView({
      collection: this.model.items,
      el: this.$('.items')
    }).render();

    return this;
  },
});

'use strict';

var Core = require('core');
var _ = require('underscore');
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    // this.listenTo(this.collection, 'move:success', this.render);
    return this;
  },
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items'
});

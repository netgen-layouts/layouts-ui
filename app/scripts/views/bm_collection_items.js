'use strict';

var Core = require('core');
var _ = require('underscore');
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    // this.listenTo(this.collection, 'move:success', this.render);
    this.setup_dnd();
    return this;
  },
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',
  setup_dnd: function(){
    this.$el.sortable({
      handle: '.handle',
      delay: 150,

      stop: function(e, ui){
        $(ui.item).data('_view').$move($(ui.item).index());
      }

    });
  }
});

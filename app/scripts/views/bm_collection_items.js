'use strict';

var Core = require('core');
var _ = require('underscore');
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    // this.listenTo(this.collection, 'move:success', this.render);
    this.on('render', this.setup_dnd);
    return this;
  },
  events: {
    'click .add-items': '$addItems'
  },
  view_items_el: '.bm-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',
  setup_dnd: function(){
    this.$('.bm-items').sortable({
      handle: '.handle',
      delay: 150,
      cancel: '.item-dynamic',
      appendTo: document.body,
      helper: 'clone',

      stop: function(e, ui){
        $(ui.item).data('_view').$move($(ui.item).index());
      }

    });
  },

  $addItems: function(){
    console.log('add items');
  }
});

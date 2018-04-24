'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.collection.bm_collection;

    // //ITEMS
    this.listenTo(this.collection, 'delete:success move:success visibility:success', this.refresh_items_and_block);
    this.listenTo(this.collection, 'request', this.startLoading);

    return this;
  },

  view_items_el: '.bm-overflown-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_overflown_items',
  context: {
    show_items: false,
  },
  events: {
    'click .js-show-items': '$show_items',
    'click .js-hide-items': '$hide_items',
  },

  startLoading: function(){
    this.bm_collection_model.set('loading', true);
  },
  endLoading: function(){
    this.bm_collection_model.set('loading', false);
  },

  set_context: function(){
    Core.View.prototype.set_context.apply(this, arguments);

    return this;
  },

  refresh_items_and_block: function(){
    this.refresh_items();
    this.refresh_block();
  },

  refresh_items: function(){
    return this.bm_collection_model.fetch_results();
  },

  refresh_block: function(){
    return this.bm_collection_model.block().fetch();
  },

  save_items: function(items){
    this.collection.bm_collection.sync_add_items(items);
  },

  $show_items: function(e){
    e && e.preventDefault();
    this.context.show_items = true;
    this.render();
  },

  $hide_items: function(e){
    e && e.preventDefault();
    this.context.show_items = false;
    this.render();
  },

});

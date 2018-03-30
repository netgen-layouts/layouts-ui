'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.collection.bm_collection;

    this.listenTo(this.bm_collection_model.block(), 'refresh:items', this.refresh_items);

    //ITEMS
    this.listenTo(this.collection, 'move:success create:success delete:success move_manual:success', this.refresh_items);
    this.listenTo(this.bm_collection_model, 'delete_all:success', this.refresh_items);

    console.log(this);
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


  set_context: function(){
    Core.View.prototype.set_context.apply(this, arguments);

    return this;
  },

  refresh_items: function(){
    return this.bm_collection_model.fetch_results();
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

'use strict';

var Core = require('../core');
var $ = Core.$;
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  extend_with: ['before'],

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.collection.bm_collection;

    // //ITEMS
    this.listenTo(this.collection, 'delete:success move:success', this.refresh_items_and_block);
    this.listenTo(this.collection, 'request', this.startLoading);

    return this;
  },

  render: function(){
    this.offset = !this.bm_collection_model.items.length ? 0 : this.bm_collection_model.items.models[0].get('position');
    this.context.before = this.before;
    this.context.message = this.getMessage();
    this.context.offset = this.offset;
    Core.View.prototype.render.apply(this, arguments);
    return this;
  },

  view_items_el: '.bm-overflown-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_overflown_items',
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

  getMessage: function(){
    var offset = this.offset;
    if (!this.before) return this.collection.length + ' manual item' + (this.collection.length > 1 ? 's' : '') + ' out of range';
    return 'Skipping ' + offset + (this.collection.length >= offset ? ' manual item' : ' item') + (offset > 1 ? 's' : '') + (this.collection.length < offset && this.collection.length ? ', ' + this.collection.length + ' of them manual' : '');
  },

});

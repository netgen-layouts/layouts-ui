'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.collection.bm_collection;

    this.listenTo(this.bm_collection_model.block(), 'refresh:items', this.refresh_items);

    // this.listenTo(this.collection, 'all', function(e){console.log(e);});

    //ITEMS
    this.listenTo(this.collection, 'move:success create:success delete:success move_manual:success', this.refresh_items_and_block);
    this.listenTo(this.collection, 'visibility:success', this.refresh_block);
    this.listenTo(this.bm_collection_model, 'delete_all:success', this.refresh_items_and_block);

    this.on('render', this.setup_dnd);
    this.on('render', this.hide_add_items_if_no_options);
    this.$init_overflown_items;

    return this;
  },

  view_items_el: '.bm-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',


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

  hide_add_items_if_no_options: function(){
    var $options = this.$el.closest('.collection-items').find('.value-type-wrapper option');
    !$options.length && this.$('.add-items').hide();
  },

  setup_dnd: function(){
    var self = this;
    this.$('.bm-items').sortable({
      delay: 150,
      cancel: '.dynamic-item',
      axis: 'y',
      helper: 'clone',
      items: '.collection-item:not(.overflown-item)',
      handle: '.handle',
      stop: function(e, ui){
        var newPosition = ui.item.index();
        ui.item.data('_view').model.get('position') !== newPosition && ui.item.data('_view').$move(newPosition + self.bm_collection_model.get('offset'));
      },

    });
  },

  save_items: function(items){
    this.collection.bm_collection.sync_add_items(items);
  },

  $init_overflown_items: function(){
  },

});

'use strict';

var Core = require('core');
var _ = require('underscore');
var Browser = require('browser');
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.collection.bm_collection;

    this.listenTo(this.bm_collection_model.block(), 'refresh:items', this.refresh_items);

    // this.listenTo(this.collection, 'all', function(e){console.log(e);});

    //ITEMS
    this.listenTo(this.collection, 'create:success', this.refresh_items_and_block);
    this.listenTo(this.collection, 'move:success delete:success', this.refresh_block);

    this.on('render', this.setup_dnd);
    return this;
  },
  events: {
    'click .add-items': '$add_items'
  },

  view_items_el: '.bm-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',


  refresh_items_and_block: function(){
    this.refresh_items();
    this.refresh_block();
  },

  refresh_items: function(){
    // return this.bm_collection_model.fetch_results();
  },

  refresh_block: function(){
    return this.bm_collection_model.block().fetch();
  },

  setup_dnd: function(){
    if(this.bm_collection_model.get('type') === 2){
      this.$el.addClass('named-collection');
    } else {
      this.$('.bm-items').sortable({
        handle: '.handle',
        delay: 150,
        cancel: '.dynamic-item',
        axis: 'y',
        helper: 'clone',

        stop: function(e, ui){
          $(ui.item).data('_view').$move($(ui.item).index());
        }

      });
    }
  },

  save_items: function(items){
    this.collection.bm_collection.sync_add_items(items);
  },

  $add_items: function(){
    var self = this;
    new Browser({
      disabled_item_ids: this.collection.pluck('value_id'),
      tree_config: {
        root_path: this.bm_collection_model.config_name
      }
    }).on('apply', function(){
      var value_type = this.tree_config.get('value_type');
      var items = this.selected_collection.map(function(item){
        return {type: 0, value_id: item.get('value'), value_type: value_type, position: 0 };
      });

      self.collection.sync_create_items(items);

    }).load_and_open();

  }
});

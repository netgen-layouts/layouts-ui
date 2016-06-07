'use strict';

var Core = require('core');
var _ = require('underscore');
var Browser = require('browser');
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    // this.listenTo(this.collection, 'delete:success', this.render);
    this.bm_collection_model = this.collection.bm_collection
    this.listenTo(this.bm_collection_model, 'error', this.refresh);
    this.on('render', this.setup_dnd);
    return this;
  },
  events: {
    'click .add-items': '$add_items'
  },

  view_items_el: '.bm-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',


  refresh: function(){
    // return this.collection.fetch({via: 'items'});
    var bm_collection = this.bm_collection_model;
    return bm_collection.fetch({via: 'result', data: {offset: bm_collection.get('offset'), limit: bm_collection.get('limit')} });
  },

  setup_dnd: function(){
    this.$('.bm-items').sortable({
      handle: '.handle',
      delay: 150,
      cancel: '.dynamic-item',
      appendTo: document.body,
      helper: 'clone',

      stop: function(e, ui){
        $(ui.item).data('_view').$move($(ui.item).index());
      }

    });
  },

  save_items: function(items){
    this.collection.bm_collection.sync_add_items(items);
  },

  $add_items: function(){
    var self = this;
    new Browser({
      tree_config: {
        root_path: this.bm_collection_model.config_name // 'ezcontent' // ezcontent, ezlocation, eztags
      }
    }).on('apply', function(){
      var value_type = this.tree_config.get('item_type');
      var items = this.selected_collection.map(function(item){
        //NOTE: type is currently hardcoded to manual items.
        return {type: 0, value_id: item.get('value'), value_type: value_type };
      });

      self.bm_collection_model.sync_add_items(items);

    }).load_and_open();



  }
});

'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var Browser = require('netgen-content-browser');
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


  set_context: function(){
    Core.View.prototype.set_context.apply(this, arguments);
    this.context.shared_and_empty = this.bm_collection_model.is_shared() && !this.collection.length;

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

  setup_dnd: function(){
    if(this.bm_collection_model.is_shared()){
      this.$el.addClass('shared-collection');
    } else {
      this.$('.bm-items').sortable({
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
      disabled_item_ids: this.collection.reduce(function(out, item){
        item.is_manual() && out.push(item.get('value_id'));
        return out;
      }, []),
      tree_config: {
        root_path: this.bm_collection_model.config_name
      }
    }).on('apply', function(){
      // @todo This needs to be configurable as some kind of mapping
      var value_type = this.tree_config.get('item_type');
      var items = this.selected_collection.map(function(item){
        return {type: 0, value_id: item.get('value'), value_type: value_type, position: 0 };
      });

      self.collection.sync_create_items(items);

    }).load_and_open();

  }
});

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
    this.listenTo(this.collection, 'create:success delete:success move_manual:success', this.refresh_items_and_block);
    this.listenTo(this.collection, 'move:success visibility:success', this.refresh_block);
    this.listenTo(this.bm_collection_model, 'delete_all:success', this.refresh_items_and_block);

    this.on('render', this.setup_dnd);
    this.on('render', this.hide_add_items_if_no_options);
    return this;
  },
  events: {
    'click .add-items': '$add_items',
    'click .js-remove-all': '$remove_all_items',
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
        $(ui.item).data('_view').$move($(ui.item).index() + self.bm_collection_model.get('offset'));
      }

    });
  },

  save_items: function(items){
    this.collection.bm_collection.sync_add_items(items);
  },

  $add_items: function(){
    var self = this;

    var $browser_config_selector = this.$el.closest('.collection-items').find('.js-browser-config-selector');
    var browser_configuration = $browser_config_selector.find('option:selected').data();
    var value_type = $browser_config_selector.val();

    new Browser({
      disabled_item_ids: this.collection.reduce(function(out, item){
        item.is_manual() && item.get('value_type') === value_type && out.push(item.get('value'));
        return out;
      }, []),
      tree_config: {
        overrides: browser_configuration,
        root_path: $browser_config_selector.val()
      }
    }).on('apply', function(){
      // @todo This needs to be configurable as some kind of mapping
      var items = this.selected_collection.map(function(item){
        return {type: 0, value: item.get('value'), value_type: value_type, position: self.bm_collection_model.get('offset') };
      });

      self.collection.sync_create_items(items);

    }).load_and_open();

  },

  $remove_all_items: function(e){
    e && e.preventDefault();
    var self = this;
    return new Core.Modal({
      title: 'Delete all manual items',
      body: 'Are you sure you want to delete all manual items? This cannot be undone.',
      apply_text: 'Delete',
    }).on('apply', function(){
      self.bm_collection_model.remove_all_items();
    }).open();
  },
});

'use strict';

var Core = require('netgen-core');
var _ = require('underscore');
var $ = Core.$;
var Browser = require('netgen-content-browser');
var BmCollectionItemsView = require('./bm_collection_items');
var BmCollectionOverflownItemsView = require('./bm_collection_overflown_items');

module.exports = Core.View.extend({
  template: 'bm_collection',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:loading', this.render);
    this.on('render', this.render_items);
    this.$el.addClass('collection-type-'+this.model.get('collection_type'));

    this.overflown_before_view = new BmCollectionOverflownItemsView({
      collection: this.model.overflown_before,
    });
    this.overflown_after_view = new BmCollectionOverflownItemsView({
      collection: this.model.overflown_after,
    });

    this.model.set('canAddItems', !!$('.js-browser-config-selector')[0].options.length);

    return this;
  },

  events: {
    'click .add-items': '$add_items',
    'click .js-remove-all': 'remove_all_items',
  },

  render_items: function(){
    this.items_view && this.items_view.remove();
    this.items_view = new BmCollectionItemsView({
      collection: this.model.items,
    });

    this.$('.items').html(this.items_view.$el);
    this.items_view.render();

    this.render_overflown_items();
    return this;
  },

  render_overflown_items: function(){
    this.overflown_before_view.setElement(this.$('.bm-overflown-before')).render();
    this.overflown_after_view.setElement(this.$('.bm-overflown-after')).render();
  },

  $add_items: function(){
    var self = this;

    var $browser_config_selector = this.$el.closest('.collection-items').find('.js-browser-config-selector');
    var browser_configuration = $browser_config_selector.find('option:selected').data();
    var value_type = $browser_config_selector.val();

    new Browser({
      disabled_item_ids: this.model.items.reduce(function(out, item){
        !item.get('is_dynamic') && item.get('value_type') === value_type && out.push(item.get('value'));
        return out;
      }, []),
      tree_config: {
        overrides: browser_configuration,
        root_path: $browser_config_selector.val()
      }
    }).on('apply', function(){
      // @todo This needs to be configurable as some kind of mapping
      var items = this.selected_collection.map(function(item){
        return {type: 0, value: item.get('value'), value_type: value_type, position: self.model.get('offset') };
      });

      self.model.items.sync_create_items(items);

    }).load_and_open();

  },

  remove_all_items: function(e){
    e && e.preventDefault();
    var self = this;
    return new Core.Modal({
      title: 'Remove all added items',
      body: 'Are you sure you want to remove all added items? This cannot be undone.',
      apply_text: 'Remove',
    }).on('apply', function(){
      self.model.remove_all_items();
    }).open();
  },

});

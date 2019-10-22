'use strict';

var Core = require('../core');
var _ = require('underscore');
var $ = Core.$;
var Browser = require('@netgen/content-browser-ui');
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
      before: true,
    });
    this.overflown_after_view = new BmCollectionOverflownItemsView({
      collection: this.model.overflown_after,
      before: false,
    });

    this.model.set('canAddItems', $('.js-browser-item-type').length && !!$('.js-browser-item-type')[0].options.length);

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

    var $browser_item_type = this.$el.closest('.collection-items').find('.js-browser-item-type');
    var browser_configuration = $browser_item_type.find('option:selected').data();
    var value_type = $browser_item_type.val();

    new Browser.Browser({
      disabledItems: this.model.items.reduce(function(out, item){
        !item.get('is_dynamic') && item.get('value_type') === value_type && out.push(item.get('value'));
        return out;
      }, []),
      overrides: browser_configuration,
      itemType: $browser_item_type.val(),
      onConfirm: function(selected){
        var items = selected.reverse().map(function(item){
          return {value: item.value, value_type: value_type, position: self.model.get('offset') };
        });

        self.model.items.sync_create_items(items);
      },
    }).open();

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

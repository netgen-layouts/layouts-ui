'use strict';

var Core = require('netgen-core');
var _ = require('underscore');
var BmCollectionItemsView = require('./bm_collection_items');

module.exports = Core.View.extend({
  template: 'bm_collection',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.on('render', this.render_items);
    this.$el.addClass('collection-type-'+this.model.get('collection_type'));
    this.model.config_name = this.$el.data('browserConfigName');
    return this;
  },

  render_items: function(){
    this.items_view && this.items_view.remove();
    this.items_view = new BmCollectionItemsView({
      collection: this.model.items,
    });

    this.$('.items').html(this.items_view.render().$el);

    return this;
  },

});

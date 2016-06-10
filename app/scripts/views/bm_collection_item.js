'use strict';

var Core = require('core');
// var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'bm_collection_item',
  className: 'collection-item',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.model.collection.bm_collection;
    this.listenTo(this.model, 'delete:success', this.remove);
    return this;
  },

  events: {
    'click .remove-toggle': '$show_remove_btn',
    'click .remove': '$remove',
    'click .cancel': '$hide_remove_btn'
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);

    this.model.get('type') === 2 && this.$el.addClass('dynamic-item');
    !this.model.get('visible') && this.$set_render_hidden();

    return this;
  },

  $move: function(i){
    this.model.save({
      position: i
    },{
      via: 'move',
      url: this.model.url('move'),
      patch: true
    });
    return this;
  },

  $remove: function(e){
    e.preventDefault();
    this.model.destroy();
  },

  $set_render_hidden: function(){
    this.$el.addClass('hidden-item');
    this.$('.name').after('<p class="note"><i class="fa fa-eye-slash"></i> Item is hidden</p>');
  },

  $show_remove_btn: function(){
    this.$el.addClass('show-remove');
  },

  $hide_remove_btn: function(){
    this.$el.removeClass('show-remove');
  },

  refresh_block: function(){
    return this.bm_collection_model.block().fetch();
  },

});

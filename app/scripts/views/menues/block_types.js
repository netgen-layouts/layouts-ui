'use strict';

var Core = require('core_boot');
var BlockTypeView = require('../block_type');
var DndView = require('../dnd');
var _ = require('underscore');

module.exports = Core.View.extend(DndView).extend({
  extend_with: ['groups'],

  // groups: ["basic", "listing", "gallery", "content", "ezpublish"],
  groups: ["basic", "listing", "gallery"],

  sort_element: '[data-zone]',
  template: 'block_types/items',
  events: {
    'click .js-open': '$toggle',
    'click .js-close': '$close',
  },



  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);

    this.listenTo(Core, 'toolbar:deactivate', this.$deactivate);
    this.listenTo(Core, 'sortable:start', this.$close);
    this.setup_global_close();
    return this;
  },

  set_context: function(){
    Core.View.prototype.set_context.apply(this, arguments);
    this.filtered_groups = this.collection.groups.get_by_ids(this.groups);
    this.context.groups = this.filtered_groups;
    return this;
  },

  render: function(){
    this._super('render', arguments);

    _.each(this.filtered_groups, function(group){
      this.render_items(group.types(), this.$('.' + group.id), BlockTypeView);
    }.bind(this));

    return this;
  },

  setup_global_close: function(){
    $('.main-content').on('click.closePanel', this.$close.bind(this));
  },


  $toggle: function() {
    this.is_open ? this.$close() : this.$open()
  },

  $open: function(e){
    this.$('.js-open').addClass('active');
    this.$('.left-panel').show();
    this.is_open = true;
    Core.trigger('toolbar:deactivate', this);
    Core.state.set({mode: 'normal'});
  },

  $close: function(){
    this.$('.left-panel').hide();
    this.$('.js-open').removeClass('active');
    this.is_open = false;
  },


  $deactivate: function(other_view){
    other_view !== this && this.$close();
  }

});

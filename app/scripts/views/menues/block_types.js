'use strict';

var Core = require('../../core');
var $ = Core.$;
var BlockTypeView = require('../block_type');
var DndView = require('../dnd');
var _ = require('underscore');

module.exports = Core.View.extend(DndView).extend({
  extend_with: ['groups'],

  sort_element: '[data-zone] .zone-body',
  template: 'block_types/items',
  events: {
    'click .js-open:not(.disable)': '$toggle',
    'click .js-close': '$close',
  },



  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);

    this.listenTo(Core, 'toolbar:deactivate', this.$deactivate);
    this.listenTo(Core, 'sortable:start', this.$close);
    this.listenTo(Core.state, 'change', this.on_state);
    this.setup_global_close();
    return this;
  },


  on_state: function(){
    var $button = this.$('> button');
    Core.state.in_mode('edit', 'edit_master', 'edit_shared') ? $button.removeClass('disable') : $button.addClass('disable');
  },

  set_context: function(){
    Core.View.prototype.set_context.apply(this, arguments);
    this.filtered_groups = this.groups ? this.collection.groups.get_by_ids(this.groups) : this.collection.groups.models;
    this.context.groups = this.filtered_groups;
    return this;
  },

  render: function(){
    this._super('render', arguments);

    _.each(this.filtered_groups, function(group){
      this.render_items(group.types(), this.$('.' + group.id), BlockTypeView);
    }.bind(this));

    this.on_state();
    this.setup_dnd_for_blocks();
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
    if (Core.state.in_mode('linking')){
      Core.trigger('toolbar:deactivate', this);
      Core.state.set({mode: 'edit', section: 'normal'});
      Core.router.navigate_to_params({type: 'edit'}, {trigger: false});
    }
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

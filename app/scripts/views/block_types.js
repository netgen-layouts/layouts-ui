'use strict';

var Core = require('core_boot');
var BlockTypeView = require('./block_type');
var DndView = require('./dnd');

module.exports = Core.View.extend(DndView).extend({
  sort_element: '[data-zone]',
  template: 'block_types/items',
  events: {
    'click .open-panel': '$open_left_panel',
    'click .close-panel': '$close_left_panels',
    'click .js-layout-mapper': '$open_layout_mapper'
  },



  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core, 'sortable:start', this.$close_left_panels);
    this.setup_global_close();
    return this;
  },

  render: function(){
    this._super('render', arguments);

    this.collection.each(function(group){
      this.render_items(group.types(), this.$('.' + group.id), BlockTypeView);
    }.bind(this));

    return this;
  },

  setup_global_close: function(){
    $('.main-content').on('click.closePanel', this.$close_left_panels.bind(this));
  },

  $open_left_panel: function(e){
    var $target = $('.left-panel-' + $(e.target).data('target'));
    if(!$target.is(':visible')){
      this.$close_left_panels();
      $(e.target).addClass('active');
      $target.show();
    } else {
      this.$close_left_panels();
    }
  },

  $close_left_panels: function(){
    this.$('.left-panel').hide();
    this.$('.open-panel').removeClass('active');
  },


  $open_layout_mapper: function() {
    this.zone_chooser_on = !this.zone_chooser_on;
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', this.zone_chooser_on);
    Core.trigger('zone_chooser:' + (this.zone_chooser_on ? 'on' : 'off'));
    //Core.router.navigate_to('layout_preview', {id: 1});
  }

});

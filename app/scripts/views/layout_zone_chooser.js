'use strict';

var Core = require('@netgen/layouts-core-ui');
var MiniZoneView = require('./mini_zone');
var DndView = require('./dnd');
var LayoutTypeChooserView = require('./layout_type_chooser');


module.exports = Core.View.extend(DndView).extend({
  template: 'layout_zone_chooser',

  ViewItem: MiniZoneView,
  view_items_el: '.items',


  events: {
    'click .js-change-layout': '$change_layout'
  },


  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.collection, 'change:mapped', this.on_mapped);
    this.context.from = this.from = Core.g.layout_types.get(Core.g.layout.get('type'));
    this.context.to = this.to = Core.g.layout_types.get(Core.router.params.layout_type_id);
    return this;
  },


  on_mapped: function() {
    var all_done = this.to && this.collection.where({mapped: true}).length === this.collection.length;
    this.$el[all_done ? 'addClass' : 'removeClass']('all_done');
  },

  $change_layout: function(){
    this.layout_chooser_modal().open();
  },


  layout_chooser_modal: function() {
     return new LayoutTypeChooserView({
      collection: Core.g.layout_types,
    });
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);

    this.setup_dnd_for_zones();
    this.on_mapped();
    !Core.router.params.layout_type_id && this.layout_chooser_modal().open();
    return this;
  },

});

'use strict';

var Core = require('netgen-core');
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

  $change_layout: function(){
    this.layout_chooser_modal().open();
  },


  layout_chooser_modal: function() {
     return new LayoutTypeChooserView({
      collection: Core.g.layout_types,
    });
  },

  render: function(){
    this.context.from = Core.g.layout_types.get(Core.g.layout.get('type'));
    this.context.to = Core.g.layout_types.get(Core.router.params.layout_type_id);

    Core.View.prototype.render.apply(this, arguments);

    this.setup_dnd_for_zones();
    !Core.router.params.layout_type_id && this.layout_chooser_modal().open();
    return this;
  },

});

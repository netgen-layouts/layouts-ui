'use strict';

var Core = require('netgen-core');
var MiniZoneView = require('./mini_zone');
var DndView = require('./dnd');


module.exports = Core.View.extend(DndView).extend({
  template: 'layout_zone_chooser',

  ViewItem: MiniZoneView,
  view_items_el: '.items',

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.setup_dnd_for_zones();
    return this;
  },

});

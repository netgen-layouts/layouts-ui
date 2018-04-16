'use strict';

var Core = require('netgen-core');
var _ = require('underscore');
var MiniZoneView = require('./mini_zone');
var DndView = require('./dnd');
var _ = require('underscore');


module.exports = Core.View.extend(DndView).extend({
  ViewItem: MiniZoneView,

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.setup_dnd_for_zones();
    return this;
  },

});

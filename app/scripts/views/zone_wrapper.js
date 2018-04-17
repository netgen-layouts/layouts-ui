'use strict';

var Core = require('netgen-core');
var ZoneView = require('../views/zone');
var DndView = require('./dnd');
var _ = require('underscore');


module.exports = Core.View.extend(DndView).extend({
  className: 'zone-wrapper',
  template: 'zone_wrapper',

  connect_with: '[data-zone-receiver]',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.$el.attr({
      'data-zone-wrapper': ''
    });
    return this;
  },


  add_zone: function(zone){
    this.model.children.push(zone);
    return this;
  },

  render_zone: function(zone){
    return new ZoneView({ model: zone }).render_basics().el;
  },


  render_zones: function(){
    this.$('.body').html(_.map(this.model.children, this.render_zone, this));
    return this;
  },

  render: function(){
    this._render();
    this.render_zones();
    this.setup_dnd_for_zone_wrappers();
    this.trigger_render();
    return this;
  },


});

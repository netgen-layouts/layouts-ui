'use strict';

var Core = require('@netgen/layouts-core-ui');
var ZoneView = require('../views/zone');
var DndView = require('./dnd');
var _ = require('underscore');


module.exports = Core.View.extend(DndView).extend({
  className: 'zone-wrapper',
  template: 'zone_wrapper',

  connect_with: '[data-zone-receiver]',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core, 'sortable:end', this.mark_wrappers_as_shared_zones);
    this.listenTo(this.collection, 'change:mapped', this.mark_wrappers_as_shared_zones)
    this.$el.attr({
      'data-zone-wrapper': ''
    });
    return this;
  },

  mark_wrappers_as_shared_zones: function(e){
    var add = this.$el.find('.linked_zone').length;
    console.log(e, add);
    this.$el[add ? 'addClass' : 'removeClass']('has_shared_zone');
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
    this.mark_wrappers_as_shared_zones();
    return this;
  },


});

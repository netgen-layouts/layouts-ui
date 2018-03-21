'use strict';

var Core = require('netgen-core');
var Layout = require('../models/layout');
var Zone = require('../models/zone');
var ZoneView = require('../views/zone');
var DndView = require('./dnd');
var _ = require('underscore');


module.exports = Core.View.extend(DndView).extend({
  className: 'zone-wrapper',
  template: 'zone_wrapper',

  connect_with: '[data-zone-receiver]',

  render: function(){
    this._render();

    console.log(this.model.children);
    this.$('.body').html(_.map(this.model.children, function(item){
      console.log(ZoneView, item, this);
      return new ZoneView({ model: item }).render_basics().el;
    }, this));

    this.setup_dnd_for_zone_wrappers()
    this.trigger_render();
    return this;
  },


});

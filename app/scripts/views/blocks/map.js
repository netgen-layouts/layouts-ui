'use strict';

var Block = require('./block');
var Inline = require('./inline');
var _ = require('underscore');

module.exports = Block.extend({

  //prevent_auto_render: true,

  render: function() {
    Block.prototype.render.apply(this,arguments);
    this.setup_map();
    return this;
  },

  setup_map: function() {
    this.$map_el = this.$('.map-embed');
    this.map = new google.maps.Map(this.$map_el.get(0), {
      center: {lat: this.model.get('parameters').latitude, lng: this.model.get('parameters').longitude},
      scrollwheel: false,
      zoom: parseInt(this.model.get('parameters').zoom),
      mapTypeId: google.maps.MapTypeId[this.model.get('parameters').map_type]
    });
  }

});

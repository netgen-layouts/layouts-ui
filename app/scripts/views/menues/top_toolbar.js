'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  events: {
    'click': '$activate',
    'click .js-layout-mapper': '$open_layout_mapper'
  },


  $activate: function(e) {
    var $button = $(e.target).closest('button');
    var is_active = $button.hasClass('active')

    this.$('.active').removeClass('active');
    !is_active && $button.addClass('active');
  },

  $open_layout_mapper: function(e) {
    Core.trigger('toolbar:deactivate', this);
    Core.state.toggle('mode_zone_link');
  }

});

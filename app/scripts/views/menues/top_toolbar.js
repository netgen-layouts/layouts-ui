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
    this.zone_chooser_on = !this.zone_chooser_on;

    Core.trigger('zone_chooser:' + (this.zone_chooser_on ? 'on' : 'off'));
    Core.trigger('toolbar:deactivate', this);

    if(this.zone_chooser_on){
      Core.trigger('editing:unmark');
      $('.right-sidebar').html(JST.sidebar2());
    }else{
      $('.right-sidebar').html(JST.sidebar());
    }
  }

});

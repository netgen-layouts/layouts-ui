'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  events: {
    //'click': '$activate',
    'click .js-layout-mapper:not(.disable)': '$open_layout_mapper'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    return this;
  },


  on_state: function(){
    this.$('.active').removeClass('active');
    this.$('[data-mode="'+Core.state.get('section')+'"]').addClass('active');


    if(Core.state.get('mode') === 'edit_master'){
      this.$('[data-mode="linking"]').addClass('disable');
    }else{
      this.$('[data-mode="linking"]').removeClass('disable');
    }

    return this;
  },


  $open_layout_mapper: function(e) {
    Core.trigger('toolbar:deactivate', this);
    Core.state.get('section') !== 'linking' && Core.state.set({mode: 'linking', section: 'linking'});
  }

});

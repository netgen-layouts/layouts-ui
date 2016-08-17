'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  events: {
    //'click': '$activate',
    'click .js-layout-mapper:not(.disable)': '$toggle_layout_mapper'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    return this;
  },


  on_state: function(){
    this.$('.active').removeClass('active');
    this.$('[data-mode="'+Core.state.get('section')+'"]').addClass('active');


    if(Core.state.in_mode('edit_master', 'edit_shared') || !Core.g.shared_layouts.length){
      this.$('[data-mode="linking"]').addClass('disable');
    }else{
      this.$('[data-mode="linking"]').removeClass('disable');
    }

    return this;
  },


  $toggle_layout_mapper: function() {
    if(!Core.state.in_mode('edit', 'linking')){return;}
    Core.state.in_mode('linking') ? this.$close_layout_mapper() : this.$open_layout_mapper();
  },


  $close_layout_mapper: function(e) {
    Core.trigger('toolbar:deactivate');
    Core.state.set({mode: 'edit', section: 'edit'});
    Core.router.navigate_to_params({type: 'edit'}, {trigger: false});
  },

  $open_layout_mapper: function(e) {
    Core.trigger('toolbar:deactivate', this);
    Core.state.get('section') !== 'linking' && Core.state.set({mode: 'linking', section: 'linking'});
    Core.router.navigate_to_params({type: 'link'}, {trigger: false});
  }

});

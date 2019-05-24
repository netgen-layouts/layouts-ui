'use strict';

var Core = require('../../core');

module.exports = Core.View.extend({
  template: 'layouts/toolbar',
  context: {
    buttons: [
      {
        mode: 'linking',
        className: 'js-layout-mapper',
        title: 'Link zone with shared layout zone',
        icon: 'icon-linking',
      },
    ],
  },
  events: {
    'click .js-layout-mapper:not(.disable)': '$toggle_layout_mapper',
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    return this;
  },


  on_state: function(){
    this.$('.active').removeClass('active');
    this.$('[data-mode="'+Core.state.get('section')+'"]').addClass('active');

    var should_disable_linking = Core.state.in_mode('edit_master', 'edit_shared', 'translate', 'change_type') || !Core.g.shared_layouts.length;

    this.$('[data-mode="linking"]')[should_disable_linking ? 'addClass' : 'removeClass']('disable');
    return this;
  },

  // Toggle mapper

  $toggle_layout_mapper: function() {
    if(!Core.state.in_mode('edit', 'linking')){return;}
    Core.state.in_mode('linking') ? this.$close_layout_mapper() : this.$open_layout_mapper();
  },


  $close_layout_mapper: function() {
    Core.trigger('toolbar:deactivate');
    Core.state.set({mode: 'edit', section: 'edit'});
    Core.router.navigate_to_params({type: 'edit'}, {trigger: false});
  },


  $open_layout_mapper: function() {
    Core.trigger('toolbar:deactivate', this);
    Core.state.get('section') !== 'linking' && Core.state.set({mode: 'linking', section: 'linking'});
    Core.router.navigate_to_params({type: 'link'}, {trigger: false});
  },

});

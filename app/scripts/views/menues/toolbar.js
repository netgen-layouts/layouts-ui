'use strict';

var Core = require('netgen-core');

module.exports = Core.View.extend(
{  events: {
    //'click': '$activate',
    'click .js-layout-mapper:not(.disable)': '$toggle_layout_mapper',
    'click .js-layout-translate:not(.disable)': '$toggle_layout_translate',
    'click .js-layout-change-type:not(.disable)': '$toggle_layout_change_type'
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
    var should_disable_translate = !Core.state.in_mode('edit', 'edit_shared', 'translate');
    var should_disable_change_type = !Core.state.in_mode('edit', 'edit_shared', 'change_type');

    this.$('[data-mode="linking"]')[should_disable_linking ? 'addClass' : 'removeClass']('disable');
    this.$('[data-mode="translate"]')[should_disable_translate ? 'addClass' : 'removeClass']('disable');
    this.$('[data-mode="change_type"]')[should_disable_change_type ? 'addClass' : 'removeClass']('disable');
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




  // Toggle translate

  $toggle_layout_translate: function() {
    if(!Core.state.in_mode('edit', 'edit_shared', 'translate')){return;}
    Core.state.in_mode('translate') ? this.$close_layout_translate() : this.$open_layout_translate();
  },


  $close_layout_translate: function() {
    Core.router.navigate_to_params({type: 'edit', locale: null});
  },


  $open_layout_translate: function() {
    Core.trigger('toolbar:deactivate', this);
    Core.router.navigate_to_params({type: 'translate', locale: Core.g.layout.get('main_locale')});
  },



  // Toggle change_type

  $toggle_layout_change_type: function() {
    if(!Core.state.in_mode('edit', 'edit_shared', 'change_type')){return;}
    Core.state.in_mode('change_type') ? this.$close_layout_change_type() : this.$open_layout_change_type();
  },


  $close_layout_change_type: function() {
    Core.router.navigate_to('layout', {id: Core.router.params.id} );
  },


  $open_layout_change_type: function() {
    Core.trigger('toolbar:deactivate', this);
    Core.g.layout_types.fetch().done(function(){
      Core.router.navigate_to('layout_change_type', {id: Core.router.params.id} );
    });
  }


});

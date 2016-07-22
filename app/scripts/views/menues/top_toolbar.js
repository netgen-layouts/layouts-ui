'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  events: {
    //'click': '$activate',
    'click .js-layout-mapper': '$open_layout_mapper'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    return this;
  },


  on_state: function(){
    this.$('.active').removeClass('active');
    this.$('[data-mode="'+Core.state.get('mode')+'"]').addClass('active');
    return this;
  },


  $open_layout_mapper: function(e) {
    Core.trigger('toolbar:deactivate', this);
    //var mode = Core.state.get('mode') === 'linking' ? 'normal' : 'linking';
    //Core.state.set({mode: mode});
    Core.state.set({mode: 'linking'});
  }

});

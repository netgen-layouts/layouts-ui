'use strict';

var Core = require('../core');
var _ = require('underscore');

module.exports = Core.View.extend({

  template: 'zone_linking_header',
  events: {
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    this.on_state();
    return this;
  },


  on_state: function(){
    if(Core.state.in_mode('choosing', 'linking')){
      this.render().$el.show();
    }else{
      this.$el.empty().hide();
    }
    return this;
  },


});

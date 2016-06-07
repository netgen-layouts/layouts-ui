'use strict';

var Core = require('core');
var _ = require('underscore');

module.exports = Core.View.extend({

  template: 'header',

  events: {
    'blur .layout-name > h1': 'set_name',
    'keydown .layout-name > h1': 'keypress_events'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.render();
    return this;
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.$layout_name = this.$('.layout-name > h1');
    return this;
  },

  set_name: function(){
  },

  keypress_events: function(e){
    if(e.keyCode === 13){
      this.$layout_name.blur();
      e.preventDefault();
    }
  }

});

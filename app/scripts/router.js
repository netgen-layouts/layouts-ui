'use strict';

var Core = require('core_boot');

module.exports = Core.Backbone.Router.extend({

  routes: {
    '': 'home',
    'layout(/:id)': 'layout'
  },


  home: function(){
    this.navigate_to('layout', {id: 1});
  },

  layout: function(){
    Core.page_layout();
  }

});

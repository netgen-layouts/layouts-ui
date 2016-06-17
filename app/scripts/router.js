'use strict';

var Core = require('core_boot');

module.exports = Core.Backbone.Router.extend({

  routes: {
    '': 'home',
    'layout': 'layout_new',
    'layout(/:id)': 'layout'
  },


  home: function(){
    this.navigate_to('layout', {id: 1});
  },

  layout: function(){
    Core.page_layout();
  },


  //Testing version
  layout_new: function(){
    Core.page_layout_new();
  },

  _layout_new: function(){
    if(Core.g.layout){
      this.navigate_to('layout', {id: Core.g.layout.id});
    }else{
      Core.page_layout_new();
    }
  }

});

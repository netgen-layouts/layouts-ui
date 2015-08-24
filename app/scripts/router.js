define(['backbone', 'app'], function(Backbone, App){
  'use strict';


  return Backbone.Router.extend({

    routes: {
      '': 'home',
      'layout(/:id)': 'layout'
    },


    home: function(){
      this.navigate_to('layout', {id: 1});
    },

    layout: function(){
      App.page_layout();
    }

  });

});

define(['backbone'], function(Backbone){
  'use strict';


  return Backbone.Router.extend({

    routes: {
      '': 'home',
      'layout(/:id)': 'layout'
    },

    home: function(){
      this.navigate('layout/' + 1, {trigger: true});
    },

    layout: function(route){
      $('[data-layout]').data('layout', route.id);
      App.init();
    }
  });

});
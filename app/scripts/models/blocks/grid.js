define(['underscore', 'backbone', './base'], function(_, Backbone, Block){
  'use strict';

  return Block.extend({
    defaults: {
      template: 'grid'
    },

    show_url: function(){
      if(this.id){
        return 'http://localhost:3000/grids/'+ this.id + '?ajax=true';
      }else{
        return 'http://localhost:3000/grids/1?ajax=true';
      }
    },

    get_url: function(){
      if(this.id){
        return 'http://localhost:3000/grids/'+ this.id +'/edit?ajax=true';
      }else{
        return 'http://localhost:3000/grids/new?ajax=true';
      }
    },

    update_url: function(){
      if(this.id){
        return 'http://localhost:3000/grids/'+ this.id +'.json';
      }else{
        return 'http://localhost:3000/grids.json';
      }
    }
  });

});

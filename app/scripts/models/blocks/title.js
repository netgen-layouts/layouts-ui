define(['./base'], function(Block){
  'use strict';

  return Block.extend({
    defaults: {
      template: 'title',
      content: 'Title',
      tag: 'h1'
    },

    show_url: function(){
      if(this.id){
        return 'http://localhost:3000/simple_blocks/'+ this.id + '?ajax=true';
      }else{
        return 'http://localhost:3000/simple_blocks/1?ajax=true';
      }
    },

    get_url: function(){
      if(this.id){
        return 'http://localhost:3000/simple_blocks/'+ this.id +'/edit?ajax=true';
      }else{
        return 'http://localhost:3000/simple_blocks/new?ajax=true';
      }
    },

    update_url: function(){
      if(this.id){
        return 'http://localhost:3000/simple_blocks/'+ this.id +'.json';
      }else{
        return 'http://localhost:3000/simple_blocks.json';
      }
    }

  });

});

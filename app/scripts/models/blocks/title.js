define(['./base'], function(Block){
  'use strict';

  return Block.extend({

    format: 'json',
    urlRoot: 'http://localhost:3000/simple_blocks',

    html_url: function(){
      if(this.isNew()){
        return this.urlRoot + '/' + '1?ajax=true';
      }else{
        return this.urlRoot +'/'+ this.id + '?ajax=true';
      }
    },

    new_or_edit_url: function(){
      if(this.id){
        return this.urlRoot + '/' + this.id +'/edit?ajax=true';
      }else{
        return this.urlRoot + '/' + 'new?ajax=true';
      }
    }

  });

});

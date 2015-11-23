define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    path: function(){
      console.log(this.param());
      return (this.param() && this.param().endpoint) || this.get('endpoint');
    }
  });

});

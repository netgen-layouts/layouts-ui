define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    path: function(){
      return (this.param() && this.param().endpoint) || this.get('endpoint');
    }
  });

});

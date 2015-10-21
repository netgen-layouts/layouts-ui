define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    path: function(){
      return (this.get('parameters') && this.get('parameters').endpoint) || this.get('endpoint');
    }
  });

});

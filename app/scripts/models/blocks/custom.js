define(['underscore', './block'], function(_, Block){
  'use strict';

  return Block.extend({
    path: function(){
      return (this.param() && this.param().endpoint) || this.get('endpoint');
    },

    toJSON: function(options){
      options || (options = {});
      var json = Block.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      var namespace = this.get_namespace();
      !_.isString(json[namespace].parameters) && (json[namespace].parameters = JSON.stringify(json[namespace].parameters));
      return json;
    }
  });

});

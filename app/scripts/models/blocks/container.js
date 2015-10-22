define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    path: 'containers',

    get_positions: function(){
      return this.get('parameters') && this.get('parameters').positions && JSON.parse(this.get('parameters').positions);
    },

    save_positions: function(){

    },

    parse: function (response) {
      response.positions = response.positions ? JSON.parse(response.positions) : [];
      return response;
    },

    toJSON: function(options){
      options || (options = {});
      var json = Block.prototype.toJSON.apply(this, arguments);
      var namespace = this.get_namespace();
      if(!options.parse){return json;}
      !_.isString(json[namespace].positions) && (json[namespace].positions = JSON.stringify(json[namespace].positions));
      return json;
    }

  });

});

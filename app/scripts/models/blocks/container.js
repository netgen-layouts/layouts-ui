define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    path: 'containers',

    get_positions: function(){
      return this.get('parameters') && this.get('parameters').positions && JSON.parse(this.get('parameters').positions);
    },

    parse: function (response) {
      response.positions = response.positions ? JSON.parse(response.positions) : [];
      return response;
    },

    toJSON: function(options){
      options || (options = {});
      var json = Block.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      !_.isString(json.positions) && (json.positions = JSON.stringify(json.positions));
      return json;
    }

  });

});

define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    path: 'sections',

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

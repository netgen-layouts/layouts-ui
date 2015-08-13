define(['underscore', 'model'], function(_, Model){
  'use strict';

  return Model.extend({
    url: function(){
      return 'http://localhost:3000/layouts/' + this.id +'.json';
    },
    parse: function (response, options) {
      response.zones = JSON.parse(response.zones);
      response.positions = JSON.parse(response.positions);
      return response;
    },

    toJSON: function(options){
      options || (options = {});
      var json = Model.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      json.zones = JSON.stringify(json.zones);
      json.positions = JSON.stringify(json.positions);
      return json;
    }

  });

});

define(['model'], function(Model){
  'use strict';

  return Model.extend({

    parse: function (response) {
      response.parameters = JSON.parse(response.parameters);
      return response;
    },

    toJSON: function(options){
      options || (options = {});
      var json = Model.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      json.parameters = JSON.stringify(json.parameters);
      return json;
    }

  });

});

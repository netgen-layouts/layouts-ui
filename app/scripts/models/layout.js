define(['underscore', 'model', 'app'], function(_, Model, App){
  'use strict';

  return Model.extend({
    format: 'json',

    path: 'layouts',

    parse: function (response) {
      response.zones = response.zones ? JSON.parse(response.zones) : [];
      response.positions = response.positions ? JSON.parse(response.positions) : [];
      return response;
    },

    toJSON: function(options){
      options || (options = {});
      var json = Model.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      json.zones = JSON.stringify(json.zones);
      json.positions = JSON.stringify(json.positions);
      return json;
    },

    inherited_zones: function(){
      return _.where(App.g.layout.get('zones'), {type: 2});
    }



  });

});

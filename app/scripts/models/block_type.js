'use strict';

var Core = require('../core');
var BmModel = require('./model');

module.exports = BmModel.extend({
  class_name: 'block_type',

  idAttribute: 'identifier',
  format: '',
  path: 'config/block_types',


  parse: function (response) {
    response.parameters = response.parameters ? JSON.parse(response.parameters) : {};
    return response;
  },

  // toJSON: function(options){
  //   console.log(options);
  //   options || (options = {});
  //   var json = Core.Model.prototype.toJSON.apply(this, arguments);
  //   if(!options.parse){return json;}
  //   json.parameters = JSON.stringify(json.parameters);
  //   return json;
  // },


  // type_name: function(){
  //   return this.get('definition_identifier');
  // },

  is_group: function(){
    return this.kind_of('Group');
  },

  is_container: function(){
    return this.attributes.is_container;
  },

  is_custom: function(){
    return this.kind_of('Custom');
  },

  kind_of: function(kind){
    return this.get('kind') === kind;
  },

  as_container: function(){
    return this.param() && this.param().as_container;
  },

  default_identifier: function(){
    return this.get('definition_identifier');
  }

});

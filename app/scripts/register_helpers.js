define(['handlebars', './helpers'], function(Handlebars, helpers){

  'use strict';

  Handlebars.r = function(parent, name){
    return parent && (parent.attributes && typeof parent.get == 'function' ? parent.get(name) : parent[name]);
  }

  for(var k in helpers){
    Handlebars.registerHelper(k, helpers[k]);
  }

  return Handlebars;

});
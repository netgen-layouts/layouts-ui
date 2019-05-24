'use strict';

var Handlebars = require('handlebars');
var helpers = require('./helpers');

Handlebars.r = function(parent, name){
  return parent && (parent.attributes && typeof parent.get == 'function' ? parent.get(name) : parent[name]);
};

for(var k in helpers){
  Handlebars.registerHelper(k, helpers[k]);
}

module.exports = Handlebars;

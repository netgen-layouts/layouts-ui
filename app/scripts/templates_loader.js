'use strict';

var Handlebars = require('./core-ui/register_helpers');
var helpers = require('./lib/handlebars/helpers');

for(var k in helpers){
  Handlebars.registerHelper(k, helpers[k]);
}

require('./templates')(Handlebars);

'use strict';

var Handlebars = require('core/app/scripts/register_helpers');
var helpers = require('./lib/handlebars/helpers');

for(var k in helpers){
  Handlebars.registerHelper(k, helpers[k]);
}

require('./templates')(Handlebars);

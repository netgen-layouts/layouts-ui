'use strict';

var Handlebars = require('netgen-core/app/scripts/register_helpers');
var helpers = require('./lib/handlebars/helpers');

for(var k in helpers){
  Handlebars.registerHelper(k, helpers[k]);
}

require('./templates')(Handlebars);

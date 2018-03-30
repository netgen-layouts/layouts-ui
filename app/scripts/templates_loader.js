'use strict';

var Handlebars = require('netgen-core/app/scripts/register_helpers');
var helpers = require('./lib/handlebars/helpers');
Handlebars.registerHelper("log", function(something) {
  console.log(something);
});
for(var k in helpers){
  Handlebars.registerHelper(k, helpers[k]);
}

require('./templates')(Handlebars);

'use strict';

require('./templates_loader');
var Core = require('core_boot');
var App = require('./init');
var Router = require('./router');

App.init();

$(function(){
  App.router = new Router();
  Core.Backbone.history.start();
});

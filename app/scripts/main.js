'use strict';

require('./templates_loader');
var Core = require('core_boot');
var App = require('./init');
var Router = require('./router');

require('./lib/jquery/video_thumb_fetcher');

App.init();

$(function(){
  App.router = new Router();
  Core.Backbone.history.start();
});

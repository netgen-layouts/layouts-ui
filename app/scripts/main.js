'use strict';

require('./templates_loader');
var Core = require('core');
var App = require('./init');

require('./lib/jquery/master_slave_selects');
require('./lib/jquery/video_thumb_fetcher');
require('./lib/jquery/view_types');

App.init();

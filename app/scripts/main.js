'use strict';

require('./templates_loader');
var Core = require('./core');
var App = require('./init');

require('./lib/jquery/master_slave_selects');
require('./lib/jquery/video_thumb_fetcher');
require('./lib/jquery/view_types');
require('./lib/jquery/bm_tooltip');

// window.Core = Core;
App.init();

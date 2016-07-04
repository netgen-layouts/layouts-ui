'use strict';
var Page = require('./application');

var Components = require('../components/main');
var ViewBlocksLoad = require('../views/blocks/load');


module.exports = Page.extend({
  master: 'application',
  layout: 'layout',
  main: function() {
    var Zones = Components.Zones();
    Zones.$el.html(Core.g.layout.get('html'))
    Zones.collection.reset(Core.g.layout.get('zones'));

    ViewBlocksLoad.load_layout_blocks();
  }
});

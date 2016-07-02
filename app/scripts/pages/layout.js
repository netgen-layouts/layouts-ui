'use strict';
var Page = require('./application');

var Components = require('../components/main');
var HeaderView = require('../views/header');
var ViewBlockTypes = require('../views/block_types');
var ViewBlocksLoad = require('../views/blocks/load');



module.exports = Page.extend({
  master: 'application',
  layout: 'layout',
  main: function() {
    $('#app').removeClass('preview');
    var Zones = Components.Zones();
    Zones.$el.html(Core.g.layout.get('html'))
    Zones.collection.reset(Core.g.layout.get('zones'));

    new ViewBlockTypes({
      el: '.blocks',
      collection: Core.g.block_type_groups
    }).render();

    ViewBlocksLoad.load_layout_blocks();

    new HeaderView({model: Core.g.layout, el: '.app-header'});

    $('.right-sidebar').html(JST.sidebar());

  }
});

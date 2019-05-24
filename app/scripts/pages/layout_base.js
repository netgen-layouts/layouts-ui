'use strict';
var Core = require('../core');
var $ = Core.$;
var Page = require('./application');
var Components = require('../components/main');



module.exports = Page.extend({
  master: 'application',
  layout: 'layout',

  main: function() {
    this.load_center();
  },

  load_center: function() {
    var Zones = Components.Zones();
    Zones.$el.html(Core.g.layout.get('html'))
    var sidebar = Core.state.detect_sidebar();
    $('.right-sidebar').html(JST[sidebar]());


  }
});


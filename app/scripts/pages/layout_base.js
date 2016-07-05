'use strict';
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
    Zones.collection.reset(Core.g.layout.get('zones'));

    $('.right-sidebar').html(JST.sidebar());


  }
});

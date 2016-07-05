'use strict';
var Page = require('./application');

var Components = require('../components/main');
var HeaderView = require('../views/header');



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


    new HeaderView({
      el: '.app-center',
      model: Core.g.layout
    }).render();

    $('.right-sidebar').html(JST.sidebar());


  }
});

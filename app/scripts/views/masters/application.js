'use strict';

var Core = require('core_boot');
var HeaderView = require('../header');
var TopToolbarView = require('../menues/top_toolbar');


module.exports = Core.View.extend({
  el: '#app',
  template: 'layouts/application',

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.$el.removeClass('preview');

    new HeaderView({
      el: '.app-center',
      model: Core.g.layout
    }).render();

    new TopToolbarView({
      el: '.bottom-menu'
    }).render();


    return this;
  },
});


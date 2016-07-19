'use strict';

var Core = require('core_boot');

var TopToolbarView = require('../menues/top_toolbar');


module.exports = Core.View.extend({
  el: '#app',
  template: 'layouts/application',

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    //this.$el.removeClass('preview');

    new TopToolbarView({
      el: '.bottom-menu'
    }).render();


    return this;
  },
});


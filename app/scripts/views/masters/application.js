'use strict';

var Core = require('netgen-core');

var Toolbar = require('../menues/toolbar');


module.exports = Core.View.extend({
  el: '#app',
  template: 'layouts/application',

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    //this.$el.removeClass('preview');

    new Toolbar({
      el: '.bottom-menu'
    }).render();


    return this;
  },
});


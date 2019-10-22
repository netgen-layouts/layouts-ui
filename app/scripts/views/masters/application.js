'use strict';

var Core = require('../../core');

var Toolbar = require('../menues/toolbar');


module.exports = Core.View.extend({
  el: '#app',
  template: 'layouts/application',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    Core.g.version = this.el.dataset.version;
    return this;
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    //this.$el.removeClass('preview');

    new Toolbar({
      el: '.bottom-menu'
    }).render();


    return this;
  },
});

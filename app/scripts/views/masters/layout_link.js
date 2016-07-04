'use strict';
var Core = require('core_boot');
var LayoutLinkChooserView = require('../layout_link_chooser');


module.exports = Core.View.extend({
  el: '#app',
  template: 'layouts/layout_link',
  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.$el.addClass('preview');

    new LayoutLinkChooserView({
      el: '.app-center'
    }).render();


    return this;
  },
});


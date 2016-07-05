'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  el: '#app',
  template: 'layouts/application',

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.$el.removeClass('preview');



    return this;
  },
});


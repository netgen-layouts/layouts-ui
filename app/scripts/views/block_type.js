'use strict';

var Core = require('../core');

module.exports = Core.View.extend({
  template: 'block_types/item',
  className: 'add-block-btn',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.$el.addClass('icn-' + this.model.get('identifier'));
    return this;
  },

});

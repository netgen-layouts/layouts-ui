'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  template: 'block_types/item',

  className: 'add-block-btn',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.$el.addClass(this.model.get('identifier'));
    return this;
  },

  dnd: function(){
    this.$el.draggable({
      helper: 'clone'
    });
    return this;
  }

});

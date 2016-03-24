'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({
  template: 'block_types/item',

  dnd: function(){
    this.$el.draggable({
      helper: 'clone'
    });
    return this;
  }

});

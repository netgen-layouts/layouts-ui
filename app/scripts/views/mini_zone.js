'use strict';

var Core = require('netgen-core');
var DndView = require('./dnd');

module.exports = Core.View.extend(DndView).extend({

  template: 'mini_zone',
  className: 'mini-zone-view',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:mapped', this.update_mapped);
    this.model.is_linked() && this.$el.addClass('shared-zone');
    this.update_mapped();
    return this;
  },

  update_mapped: function(){
    console.log('update_mapped', this.model.attributes, this.model.get('mapped'));
    console.log('mapped', this.$el);
    this.$el[this.model.get('mapped') ? 'hide' : 'show']();
  }

});

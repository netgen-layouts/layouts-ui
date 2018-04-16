'use strict';

var Core = require('netgen-core');
var Layout = require('../models/layout');
var Zone = require('../models/zone');
var DndView = require('./dnd');
var _ = require('underscore');


module.exports = Core.View.extend(DndView).extend({

  template: 'mini_zone',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:mapped', this.update_mapped);
    this.model.is_linked() && this.$el.addClass('shared-zone');
    this.update_mapped();
    return this;
  },

  update_mapped: function(){
    console.log('update_mapped', this.model.attributes);
    this.$el[this.model.get('mapped') ? 'hide' : 'show']();
  }

});

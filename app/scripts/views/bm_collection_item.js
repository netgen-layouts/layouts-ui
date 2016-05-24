'use strict';

var Core = require('core');
// var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'bm_collection_item',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    return this;
  },

  events: {
    click: '$move'
  },

  $move: function(){
    this.model.save({
      position: parseInt(window.prompt('Position?'))
    },{
      via: 'move',
      url: this.model.url('move'),
      patch: true
    });
    return this;
  },
});

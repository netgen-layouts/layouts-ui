'use strict';

var Core = require('core');
// var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'bm_collection_item',
  className: 'collection-item',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    return this;
  },

  events: {
    'click .remove': '$remove'
  },

  $move: function(i){
    this.model.save({
      position: i
    },{
      via: 'move',
      url: this.model.url('move'),
      patch: true
    });
    return this;
  },

  $remove: function(e){
    e.preventDefault();
    console.log('remove click');
  }
});

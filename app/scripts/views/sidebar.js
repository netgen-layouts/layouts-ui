'use strict';

var Core = require('core');
var _ = require('underscore');
var FormView = require('./form');

module.exports = Core.View.extend({

  template: 'sidebar',
  className: 'sidebar',

  prevent_auto_render: true,


  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'destroy', this.destroy);
    return this;
  },


  destroy: function(){
    $('.right-sidebar').html(JST.sidebar());
    this.remove();
  },


  render: function(){

    var self = this;

    this.$('[data-form]').each(function(){
      var $this = $(this);
      new FormView({
        el: $this,
        model: self.model,
        url: $this.data('form')
      }).load();

    })

    this.trigger_render();

    return this;
  }

});

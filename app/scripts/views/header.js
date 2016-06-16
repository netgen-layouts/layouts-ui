'use strict';

var Core = require('core');
var _ = require('underscore');

module.exports = Core.View.extend({

  template: 'header',

  events: {
    'submit form.js-layout': 'set_name',
    'click .js-show-form': 'enter_editing',
    'click .js-cancel': 'cancel_editing'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'save:success', this.after_save);

    this.render();

    return this;
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);
    this.$name_input = this.$('.js-name');
    return this;
  },

  set_name: function(e){
    e.preventDefault();
    this.model.save(this.serialize().params, {method: "POST", patch: true});
  },

  enter_editing: function(){
    this.context.editing = true;
    this.render();
    this.$('form.js-layout input[name="name"]').focus();

    var strLength = this.$name_input.val().length * 2;
    this.$name_input.focus();
    this.$name_input[0].setSelectionRange(strLength, strLength);
  },

  exit_editing: function(){
    this.context.editing = false;
    this.render();
  },

  cancel_editing: function(e){
    e.preventDefault();
    this.exit_editing();
  },

  after_save: function(){
    this.exit_editing();
  }

});

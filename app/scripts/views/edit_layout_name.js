'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var _ = require('underscore');

module.exports = Core.Modal.extend({
  extend_with: ['url'],

  template: 'edit_layout_name',
  ENTER_KEY: 13,

  initialize: function(){
    Core.Modal.prototype.initialize.apply(this, arguments);
    this.modal_options = {
      backdrop: 'static'
    };

    this.listenTo(Core.router, 'route', this.close);

    this.on('save:success', this.on_success);
    this.on('save:error', this.on_error);
    this.on('apply', this.on_apply);
    return this;
  },

  events: {
    'submit form': '$submit',
    'keypress input': '$enter',
    'keypress textarea': '$enter'
  },


  on_success: function(resp){
    this.close();
    this.model.set({
      name: this.newData.name,
      description: this.newData.description
    });
  },


  on_error: function(xhr){
    this.context.body = xhr.responseText;
    this.render();
  },


  open: function(){
    $.get(this.url).done(function(resp){
      this.context.body = resp;
      Core.Modal.prototype.open.apply(this, arguments);
    }.bind(this));
    return this;
  },

  $enter: function(e) {
    if (e.which === this.ENTER_KEY) {
      this.$submit(e);
    }
    return this;
  },

  $submit: function(e){
    e.preventDefault();
    this.newData = {
      name: this.$('#edit_name').val().trim(),
      description: this.$('#edit_description').val().trim(),
    };
    return this.$('form')
        .ajax_submit()
        .done(function(){
          this.trigger.apply(this, ['save:success'].concat(_.toArray(arguments)) );
        }.bind(this))
        .fail(function(){
          this.trigger.apply(this, ['save:error'].concat(_.toArray(arguments)) );
        }.bind(this))
  },

  $apply: function(e){
    this.$submit.apply(this, arguments);
  }

});

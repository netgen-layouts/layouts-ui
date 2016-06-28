'use strict';

var Core = require('core_boot');
var _ = require('underscore');

module.exports = Core.Modal.extend({
  extend_with: ['url'],

  template: 'new_layout',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.modal_options = {
      keyboard: false,
      backdrop: 'static'
    };
    this.on('save:success', this.on_success);
    this.on('save:error', this.on_error);
    this.on('apply', this.on_apply);
    return this;
  },

  events: {
    'submit form': '$submit'
  },


  on_success: function(resp){
    this.close();
    Core.router.navigate_to('layout', {id: resp.id});
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


  $submit: function(e){
    e.preventDefault();

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

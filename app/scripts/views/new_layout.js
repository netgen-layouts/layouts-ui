'use strict';

var Core = require('core_boot');
var _ = require('underscore');

module.exports = Core.Modal.extend({
  extend_with: ['url'],

  template: 'new_layout',
  ENTER_KEY: 13,

  initialize: function(){
    Core.Modal.prototype.initialize.apply(this, arguments);
    this.modal_options = {
      keyboard: false,
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
    'keypress input': '$enter'
  },


  render: function(){
    Core.Modal.prototype.render.apply(this, arguments);
    var $shared_checkbox = this.$('#create_shared');
    Core.router.params.shared && $shared_checkbox.prop('checked', true);
    $shared_checkbox.parent().hide();
    return this;
  },

  on_success: function(resp){
    this.close();
    Core.router.navigate_to('layout', {id: resp.id, type: 'edit'});
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

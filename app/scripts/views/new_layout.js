'use strict';

var Core = require('core_boot');

module.exports = Core.Modal.extend({
  template: 'new_layout',

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'save:success', this.on_save);
    this.on('apply', this.on_apply);
    return this;
  },

  events: {
    'submit form': '$submit'
  },

  on_save: function(){
    this.close();
    Core.router.navigate_to('layout', {id: this.model.id});
    Core.layout_created = this.model;
  },


  $submit: function(e){
    e.preventDefault();
    this.model.save(this.serialize().params);
  },

  $apply: function(e){
    this.$submit.apply(this, arguments);
  }

});

'use strict';

var Core = require('../core_base');
var Modal = require('./modal');

module.exports = Core.FormModal = Modal.extend({

  template: 'form_modal',

  prevent_auto_render: true,

  initialize: function(options){
    Modal.prototype.initialize.apply(this, arguments);
    options || (options = {});

    this.listenTo(this.model, 'sync', this.open);
    this.listenTo(this.model, 'edit:success', this.open);
    this.listenTo(this.model, 'save:success', this.close);
    this.listenTo(this.model, 'save:error', this.on_update_error);
    return this;
  },

  on_update_error: function(){
    this.render();
  },

  $submit: function (e) {
    e && e.preventDefault();

    var options = {},
        params = this.serialize();

    if(this.model.is_image()){
      options.form_data = new FormData(this.$('form').get(0));
      this.model.save(params, options);
    }else{
      this.model.save_via_form(this);
    }

  },

  $apply: function () {
    this.$submit.apply(this, arguments);
  }

});

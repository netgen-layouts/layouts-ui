define(['./modal'], function(Modal){
  'use strict';

  return Modal.extend({

    template: 'form_modal',

    prevent_auto_render: true,

    initialize: function(options){
      Modal.prototype.initialize.apply(this, arguments);
      options || (options = {});
      this.form_namespace = options.form_namespace;

      this.listenTo(this.model, 'edit:success', this.open);
      this.listenTo(this.model, 'save:success', this.close);
      this.listenTo(this.model, 'update:error', this.on_update_error);
      return this;
    },


    on_update_error: function(model, ajax){
      this.model.set({form: ajax.responseJSON.form});
      this.render();
    },


    $submit: function (e) {
      e && e.preventDefault();
      var params = this.serialize().params[this.form_namespace];
      this.model.save(params);
    },

    $apply: function () {
      this.$submit.apply(this, arguments);
    }

  });

});

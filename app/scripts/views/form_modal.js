define(['inflection', './modal'], function(Inflection, Modal){
  'use strict';

  return Modal.extend({

    template: 'form_modal',

    prevent_auto_render: true,

    initialize: function(options){
      Modal.prototype.initialize.apply(this, arguments);
      options || (options = {});

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

      var options = {},
          form_namespace = this.get_form_namespace(),
          params = this.serialize().params[form_namespace];

      if(form_namespace === 'image'){
        options.form_data = new FormData(this.$('form').get(0));
      }

      this.model.save(params, options);
    },

    get_form_namespace: function(){
      var kind = this.model.template().get('kind');
      return kind === 'Custom' ? Inflection.singularize(this.model.get('endpoint')) : Inflection.underscore(kind);
    },

    $apply: function () {
      this.$submit.apply(this, arguments);
    }

  });

});

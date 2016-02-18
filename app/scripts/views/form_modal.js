define(['inflection', './modal'], function(Inflection, Modal){
  'use strict';

  return Modal.extend({

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

    get_form_namespace: function(){
      var kind = this.model.template().get('kind');
      return kind === 'Custom' ? Inflection.singularize(this.model.get('endpoint')) : Inflection.underscore(kind);
    },

    $apply: function () {
      this.$submit.apply(this, arguments);
    }

  });

});

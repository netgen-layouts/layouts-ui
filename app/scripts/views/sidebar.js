'use strict';

var Core = require('core');
var _ = require('underscore');
// var Inflection = require('inflection');

module.exports = Core.View.extend({

  template: 'sidebar',
  className: 'sidebar',

  prevent_auto_render: true,

  events: {
    'submit form': '$submit',
    'keyup': '$delayed_submit',
    'change': '$delayed_submit'
  },

  initialize: function(options){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'read:success', this.render);
    // this.listenTo(this.model, 'edit:success', this.open);
    // this.listenTo(this.model, 'save:success', this.close);
    this.listenTo(this.model, 'save:error', this.render);
    return this;
  },

  // on_update_error: function(){
  //   this.render();
  // },

  $delayed_submit: _.debounce(function(){
    this.$submit();
  }, 200),

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

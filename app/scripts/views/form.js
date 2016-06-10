'use strict';

var Core = require('core');
var _ = require('underscore');


module.exports = Core.View.extend({
  extend_with: ['url'],

  prevent_auto_render: true,

    events: {
    'submit form': '$submit',
    'keyup': '$delayed_submit',
    'change': '$delayed_submit'
  },

  load: function(){
    $.get(this.url).done(function(response){
      this.$el.html(response.form);
      var self = this;
      $('[data-block].editing [data-inline-child]').each(function(){
        var name = $(this).data('attr');
        self.$('[name*="['+name+']"]').parent().hide();
      });
    }.bind(this));
    return this;
  },

  $delayed_submit: _.debounce(function(){
    this.$submit();
  }, 500),


  $submit: function (e) {
    e && e.preventDefault();

    var options = {},
        params = this.serialize();

    if(this.model.is_image()){
      options.form_data = new FormData(this.$('form').get(0));
      this.model.save(params, options);
    }else{
      this.model.save_via_form(this, 'sidebar_save');
    }

  },

});

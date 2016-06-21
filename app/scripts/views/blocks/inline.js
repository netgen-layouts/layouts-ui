'use strict';

var _ = require('underscore');

module.exports = {

  prevent_auto_render: true,

  events: {
    'keyup [data-inline-child]': '$keyup',
    'focus [data-inline-child]': '$render_sidebar'
  },


  render: function(){
    this._super('render', arguments);
    var $inline = this.$('[data-inline-child]');
    var hint = $inline.data('hint') || '..........................';
    $inline.after('<span>'+ hint +'</span>');
    return this;
  },


  $render_sidebar: function(){
    this.model.trigger('edit');
    return this;
  },


  $keyup: function (e) {
    var $target = $(e.target), name = $target.data('attr');
    var value = $target.html().trim();
    var $input_or_textarea = $('.sidebar [name*="['+name+']"]');
    value = value.replace(/<br>/g, '\n');
    value = value.replace(/&nbsp;/g, ' ');

    if(!$input_or_textarea.length){
      //throw new Error('Inline element not found in sidebar form.');
      return;
    }

    if(_.isEmpty(value)){return;}
    $input_or_textarea.val(value);
    this.debounced_save($input_or_textarea);
  },


  debounced_save: _.debounce(function($input){
    this.$save($input);
  }, 500),

  $save: function($input){

    this.model.save_via_form($input.closest('form'))
      .done(this.model.trigger.bind(this.model, 'save_inline:done'))
      .fail(this.model.trigger.bind(this.model, 'save_inline:error'));

  }
};

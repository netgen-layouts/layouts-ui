'use strict';

var Core = require('netgen-core');
var _ = require('underscore');
var $ = Core.$;
var striptags = require('striptags');

module.exports = {

  prevent_auto_render: true,

  events: {
    'paste [data-inline-child]': '$paste',
    'keyup [data-inline-child]': '$keyup',
    'focus [data-inline-child]': '$render_sidebar'
  },


  initialize: function(){
    this._super('initialize', arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    this.listenTo(this.model, 'restore:success', this.render);
    return this;
  },


  on_state: function(){
    this.update_contenteditable();
  },

  render: function(){
    this._super('render', arguments);
    var $inline = this.$('[data-inline-child]');
    var hint = $inline.data('hint') || '..........................';
    $inline.after('<span>'+ hint +'</span>');
    this.$inline = $inline;

    this.update_contenteditable();
    return this;
  },


  update_contenteditable: function(){
    var editable = Core.state.in_mode('edit', 'edit_shared'); // && this.model.belongs_to_current_layout();
    this.$inline.attr('contenteditable', editable)
  },


  $render_sidebar: function(){
    this.model.trigger('edit');
    return this;
  },

  $paste: function(e) {
    var $target = this.$('[data-inline-child]');
    //Deffer
    setTimeout(function() {
      $target
        .html(striptags($target.html(), ['br']))
        .trigger('keyup')
    }.bind(this), 0);

  },


  $keyup: function (e) {
    var $target = $(e.target), name = $target.data('attr');
    var $input_or_textarea = $('.sidebar [name*="['+name+']"]');
    var value = this.get_value($target);

    if(!$input_or_textarea.length){
      //throw new Error('Inline element not found in sidebar form.');
      return;
    }

    if(_.isEmpty(value)){return;}
    this.debounced_save($input_or_textarea, function(){
      return this.get_value($target);
    }.bind(this));
  },


  get_value: function($el) {
    var value = $el.html().trim();
    value = value.replace(/<br>/g, '\n');
    value = value.replace(/&nbsp;/g, ' ');
    return value;
  },


  debounced_save: _.debounce(function($input, get_value){
    $input.val(get_value());
    this.$save($input);
  }, 500),

  $save: function($input){
    this.model.save_via_form($input.closest('form'))
      .done(this.model.trigger.bind(this.model, 'save_inline:done'))
      .fail(this.model.trigger.bind(this.model, 'save_inline:error'));

  }

};

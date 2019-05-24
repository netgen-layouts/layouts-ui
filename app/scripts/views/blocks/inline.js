'use strict';

var Core = require('../../core');
var _ = require('underscore');
var $ = Core.$;
var striptags = require('striptags');

module.exports = {

  events: {
    'paste [data-inline-child]': '$paste',
    'keyup [data-inline-child]': '$keyup',
    'focus [data-inline-child]': '$render_sidebar'
  },


  initialize: function(){
    this._super('initialize', arguments);
    this.listenTo(Core.state, 'change', this.on_state);
    this.listenTo(this.model, 'restore:success', this.render);
    this.listenTo(this.model, 'sidebar:loaded', this.on_sidebar_loaded);
    this.listenTo(this.model, 'sidebar:destroyed', this.on_sidebar_destroyed);
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

  on_sidebar_loaded: function(){
    this.sidebarLoaded = this.editing;
    this.update_contenteditable();
    this.$inline.focus()
  },

  on_sidebar_destroyed: function(){
    this.sidebarLoaded = false;
    this.update_contenteditable();
    this.$inline.blur()
  },

  update_contenteditable: function(){
    var editable = !!this.sidebarLoaded && (Core.state.in_mode('edit', 'edit_shared') ||
                   Core.state.in_mode('translate'));
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
    var value = $el[0].innerText.trim();
    return value;
  },


  debounced_save: _.debounce(function($input, get_value){
    $input.val(get_value());
    this.$save($input);
  }, 500),

  $save: function($input){
    this.model.save_via_form($input.closest('form'), 'save_inline', {silent: true});
  }

};

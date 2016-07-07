'use strict';

var Core = require('core');
var _ = require('underscore');


module.exports = Core.View.extend({
  extend_with: ['url'],

  prevent_auto_render: true,
  ENTER_KEY: 13,

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.is_query_form = this.$el.data('queryForm');


    this.listenTo(this.model, 'sidebar_save:success', this.trigger_refresh_items);

    return this;
  },

  events: {
    'submit form': '$submit',
    'keypress input': '$enter',

    'keyup input': '$delayed_submit',
    'keyup textarea': '$delayed_submit',

    'change': '$submit',
    'change input[type="checkbox"]': '$submit',
    'change input[type="radio"]': '$submit',
    'browser:change .js-input-browse': '$browse_change'
  },

  trigger_refresh_items: function(){
    if(this.is_query_form){
      // console.log('trigger trigger_refresh_items', this.is_query_form);
      this.model.trigger('refresh:items');
    }
    return this;
  },


  $enter: function(e){
    if(e.which == this.ENTER_KEY) {
      $(e.target).blur();
    }
    return this;
  },


  $browse_change: function(e, data){
    this.$submit();
    return this;
  },

  load: function(){
    return $.get(this.url).done(function(response){
      this.$el.html(response);
      var self = this;
      $('[data-block].editing [data-inline-child], [data-block].editing .alloy-editor, [data-block].editing .ace-editor').each(function(){
        var name = $(this).data('attr');
        self.$('[name*="['+name+']"]').parent().hide();
      });

      self.trigger_render();
    }.bind(this));
  },

  $delayed_submit: _.debounce(function(e){
    if(this.should_skip(e)){return;}
    this.$submit(e);
  }, 500),


  should_skip: function(e){
    return $(e.target).hasClass('js-skip-on-change');
  },


  $submit: function (e) {
    e && e.preventDefault();
    if(e && this.should_skip(e)){return;}
    var options = {};
        // params = this.serialize().params;

    var serialized_params = $('form').serialize();

    var is_same = this.params_has_changed(serialized_params, this.last_params);
    // is_same && console.warn("IS SAMEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe");
    if(is_same){return;}

    this.last_params = serialized_params;


    // if(this.model.is_image()){
    //   options.form_data = new FormData(this.$('form').get(0));
    //   this.model.save(params, options);
    // }else{
      this.model.save_via_form(this, 'sidebar_save');
    // }

  },


  //TODO: add token name to config
  params_has_changed: function(old_params, new_params){
    var replacer = /ezxform_token%5D=[a-zA-Z0-9-_]+/;
    old_params && (old_params = old_params.replace(replacer, ''));
    new_params && (new_params = new_params.replace(replacer, ''));
    return old_params === new_params;

  }

});

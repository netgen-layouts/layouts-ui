'use strict';

var Core = require('../core');
var $ = Core.$;
var _ = require('underscore');


module.exports = Core.View.extend({
  extend_with: ['url'],

  prevent_auto_render: true,
  ENTER_KEY: 13,

  initialize: function() {
    Core.View.prototype.initialize.apply(this, arguments);
    this.is_query_form = this.$el.data('queryForm');
    this.form_id = this.$el.data('form').replace(/\/.+\/app\//g, '').replace(/\//g, '_');

    this.is_query_form && this.listenTo(this.model, 'sidebar_save:'+this.form_id+':success', this.trigger_refresh_items);

    this.listenTo(this.model, 'sidebar_save:' + this.form_id + ':success', this.on_success);
    this.listenTo(this.model, 'sidebar_save:' + this.form_id + ':error', this.on_error);

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
    'browser:change .js-input-browse': '$submit',
    'browser:change .js-multiple-browse': '$submit',
    'focus input': '$on_focus'
  },

  trigger_refresh_items: function() {
    this.model.trigger('refresh:items');
    return this;
  },


  remove_errors: function() {
    this.$('.errors').remove();
    this.$('.error-input').removeClass('error-input');
  },


  $on_focus: function(e) {
    this.last_focused_item = e.target.id;
  },


  $enter: function(e) {
    if (e.which == this.ENTER_KEY) {
      $(e.target).blur();
    }
    return this;
  },


  $browse_change: function(e, data) {
    this.$submit();
    return this;
  },


  on_success: function(model_attributes) {
    this.model.set(model_attributes);
    this.remove_errors();
  },

  on_error: function(response) {
    this.render_form(response.responseText);
    var $el = this.$('#' + this.last_focused_item);
    $el.focus();

    /* Move cursor to the end of input */
    var val = $el.val();
    $el.val('').val(val)
  },

  load: function() {
    return $.get(this.url).done(this.render_form.bind(this));
  },


  render_form: function(response) {
    this.$el.html(response);
    var self = this;

    if (Core.state.get('mode') !== 'preview') {
      $('[data-block].editing [data-inline-child], [data-block].editing .rich-text-editor, [data-block].editing .ace-editor, [data-block].editing .attr-hide').each(function() {
        var name = $(this).data('attr');
        self.$('[name*="[' + name + ']"]').parent().addClass('hidden');
      });
    }
    this.$multiple_select_height();

    this.$el.find('.datetimepicker').each(function () {
      new Core.DateTimePicker({
        el: $(this),
        pluginOptions: {
          inline: true,
          sideBySide: false,
          widgetParent: $(this).closest(".row-input"),
          keepOpen: false
        }
      }).on('change', function () {
        self.$submit()
      })
    })

    self.trigger_render();
  },

  $delayed_submit: _.debounce(function(e) {
    if (this.should_skip(e)) {
      return;
    }
    this.$submit(e);
  }, 500),


  should_skip: function(e) {
    return $(e.target).hasClass('js-skip-on-change');
  },

  $multiple_select_height: function(){
    this.$('select[multiple]').each(function(){
      var l = $(this).find('option').length + $(this).find('optgroup').length;
      (l > 10) && (l = 10);
      $(this).attr('size', l);
    });
  },

  $submit: function(e) {
    e && e.preventDefault();
    if (e && this.should_skip(e)) {
      return;
    }
    var options = {};
    // params = this.serialize().params;

    var serialized_params = $('form').serialize();

    var is_same = this.params_has_changed(serialized_params, this.last_params);
    if (is_same) {
      return;
    }

    this.last_params = serialized_params;


    var query_form_event = this.is_query_form ? 'sidebar_save:query_form' : '';
    var trigger_events = ['sidebar_save', 'sidebar_save:' + this.form_id, query_form_event].join(' ');
    this.model.save_via_form(this, trigger_events, this);


  },


  //TODO: add token name to config
  params_has_changed: function(old_params, new_params) {
    var replacer = /(\w+)?_token%5D=[a-zA-Z0-9-_]+/;
    old_params && (old_params = old_params.replace(replacer, ''));
    new_params && (new_params = new_params.replace(replacer, ''));
    return old_params === new_params;

  }

});

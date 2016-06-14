'use strict';

var Core = require('core');
var _ = require('underscore');
var Browser = require('browser');


module.exports = Core.View.extend({
  extend_with: ['url'],

  prevent_auto_render: true,

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.is_query_form = this.$el.data('queryForm');

    this.listenTo(this.model, 'sidebar_save:success', function(){
      this.is_query_form && this.model.trigger('refresh:items');
    });

    return this;
  },

  events: {
    'submit form': '$submit',
    'keyup input': '$delayed_submit',
    'keyup textarea': '$delayed_submit',

    'change select': '$submit',
    'change input[type="checkbox"]': '$submit',
    'change input[type="radio"]': '$submit',


    'focus #query_full_edit_parameters_parent_location_id': '$browse'
  },


  setup_browsable: function(){
    var $input = $('#query_full_edit_parameters_parent_location_id');
    this.$input = $input;
    this.$name = $('<div></div>');
    $input.before(this.$name);
    return this;
  },

  $browse: function(){
    var self = this;
    new Browser({
      tree_config: {
        root_path: 'ezlocation' // ezcontent, ezlocation, eztags
      }
    }).on('apply', function(){
      // var value_type = this.tree_config.get('item_type');
      var selected = this.selected_collection.first();
      self.$input.val(selected.get('value'));
      self.$name.html(selected.get('name'));

    }).load_and_open();

  },

  form_render: function(){
    this.setup_browsable();
  },

  load: function(){
    $.get(this.url).done(function(response){
      this.$el.html(response.form);
      var self = this;
      $('[data-block].editing [data-inline-child]').each(function(){
        var name = $(this).data('attr');
        self.$('[name*="['+name+']"]').parent().hide();
        self.form_render();
      });
    }.bind(this));
    return this;
  },

  $delayed_submit: _.debounce(function(e){
    if($(e.target).hasClass('.js-skip-on-change')){return;}
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

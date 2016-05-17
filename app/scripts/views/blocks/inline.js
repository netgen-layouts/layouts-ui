'use strict';

var _ = require('underscore');

module.exports = {

  prevent_auto_render: true,

  initialize: function(){
    this._super('initialize', arguments);
    this.listenToOnce(this.model, 'save:success', this.render_with_new_data);
    this.listenTo(this.model, 'sidebar_save:success', this.render);
    this.debounced_save = _.debounce(this.$save, 200);
    return this;
  },

  events: {
    'keyup [data-inline-child]': '$keyup'
  },


  $keyup: function (e) {
    var $target = $(e.target), name = $target.data('attr');
    var value = $target.text().trim();
    var $input = $('.sidebar input[name*="['+name+']"]');
    $input.val(value);
    this.debounced_save($input);
  },

  $save: function($input){

    this.model.save_via_form($input.closest('form'))
      .done(this.model.trigger.bind(this.model, 'save_inline:done'))
      .fail(this.model.trigger.bind(this.model, 'save_inline:error'))

  }
};

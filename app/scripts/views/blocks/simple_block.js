'use strict';

var Block = require('./block');

module.exports = Block.extend({

  events: {
    'blur .simple-block': '$blur',
    'keyup [data-inline]': '$keyup'
  },

  $keyup: function (e) {
    var $target = $(e.target), name = $target.data('attr');
    console.log('keyup', name);
    this.$('input[name*="['+name+']"]').val($target.text().trim());
  },

  $blur: function(e){
    e.preventDefault();
    this.model.save_via_form(this);
  }

});

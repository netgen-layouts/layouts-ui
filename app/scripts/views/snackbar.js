'use strict';

var Core = require('../core_base');
var View = require('../extended/view');
var $ = Core.$;

module.exports = Core.Snackbar = View.extend({
  template: 'snackbar',

  className: 'snackbar',

  events: {
    'click .snackbar-box':  'close',
  },

  initialize: function(options){
    View.prototype.initialize.apply(this, arguments);
    this.context.message = options.message;

    Core.activeSnackbar && Core.activeSnackbar.close();
    this.open();

    return this;
  },

  insert: function(){
    var $wrapper = $('.js-snackbar-wrapper');
    if(!$wrapper.length){
      $wrapper = $('<div class="ngc js-snackbar-wrapper">');
      $(document.body).append($wrapper);
    }
    $wrapper.append(this.$el);
    return this;
  },

  open: function(){
    if(this.is_open){ return this; }
    this.render();
    this.insert();
    this.trigger('open');
    this.is_open = true;
    Core.activeSnackbar = this;
    window.setTimeout(function(){this.close('slide')}.bind(this), 3000);
    return this;
  },

  close: function(effect){
    this.$el.addClass(effect === 'slide' ? 'slide-out' : 'fade-out');
    window.setTimeout(function(){
      this.is_open = false;
      this.trigger('close');
      this.remove();
      if (Core.activeSnackbar === this) Core.activeSnackbar = null;
    }.bind(this), 200);
  },

});

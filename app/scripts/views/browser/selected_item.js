define(['view'], function(View){
  'use strict';

  return View.extend({
    tagName: 'li',
    template: 'browser/selected_item',

    events: {
      'click a': '$remove_item'
    },

    $remove_item: function(e){
      e.preventDefault();
      $('#item-' + this.model.id).trigger('click');
      this.model.uncheck();
    },



  });

});

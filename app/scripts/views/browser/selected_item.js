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
      $('tr[data-id="' + this.model.id + '"]').data('_view').$toogle_select();
    }

  });

});

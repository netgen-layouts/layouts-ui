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
      var $tr = $('tr[data-id="' + this.model.id + '"]');
      if($tr.length){
        $tr.data('_view').$toogle_select();
      }else{
        this.uncheck_item();
      }
    },

    uncheck_item: function(){
      this.model.uncheck();
      this.remove();
    }

  });

});

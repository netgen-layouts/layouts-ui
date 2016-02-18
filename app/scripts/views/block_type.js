define(['view'], function(View){
  'use strict';

  return View.extend({
    template: 'block_types/item',

    dnd: function(){
      this.$el.draggable({
        helper: 'clone'
      });
      return this;
    }

  });

});

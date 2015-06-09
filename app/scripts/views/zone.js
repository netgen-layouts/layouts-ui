define(['view'], function(View){
  'use strict';

  return View.extend({
    // template: 'blocks/item',
    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.dnd();
      return this;
    },

    dnd: function(){
      this.$el.droppable({
        drop: function( event, ui ) {
          var view = $(ui.draggable).data('_view');
          console.log(view);
          $( this ).effect('highlight');
        }
      });
    }
  });

});

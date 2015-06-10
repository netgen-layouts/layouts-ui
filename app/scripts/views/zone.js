define(['view', 'models/block', './block'], function(View, Block, ViewBlock){
  'use strict';

  return View.extend({
    // template: 'blocks/item',
    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      // this.dnd();
      return this;
    },

    dnd: function(){
      this.$el.droppable({
        drop: function( event, ui ) {
          console.log(event, ui);
          var view = $(ui.draggable).data('_view');

          var block = new Block({
            type: view.model
          });

          var view_block = new ViewBlock({
            model: block
          });

          $(this).append(view_block.render().el);
        }
      });
    }
  });

});

define(['view', 'app'], function(View, App){
  'use strict';

  return View.extend({

    events: {
      'click': '$goto_parent'
    },
    // template: 'blocks/item',
    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      // this.dnd();
      this.mark_zone_type();

      return this;
    },

    mark_zone_type: function(){
      this.$el.addClass('zone_type_'+ this.model.get('type_name'));
    },

    $goto_parent: function(e){
      e.preventDefault();
      if(this.model.is_inherited()){
        App.router.navigate_to('layout', {id: App.g.layout.get('parent_id')});
      }
    },

    is_section: function(){
      return false;
    },

    // dnd: function(){
    //   this.$el.droppable({
    //     drop: function( event, ui ) {
    //       console.log(event, ui);
    //       var view = $(ui.draggable).data('_view');

    //       var block = new Block({
    //         type: view.model
    //       });

    //       var view_block = new ViewBlock({
    //         model: block
    //       });

    //       $(this).append(view_block.render().el);
    //     }
    //   });
    // }
  });

});

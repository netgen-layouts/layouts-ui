define(['view'], function(View){
  'use strict';

  return View.extend({
    template: 'block_templates/item',

    render: function(){
      View.prototype.render.apply(this, arguments);
      // this.dnd();
      return this;
    },

    dnd: function(){
      this.$el.draggable({
        helper: 'clone'
      });
      return this;
    }

  });

});

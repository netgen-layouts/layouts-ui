define(['view', 'views/modal'], function(View, Modal){
  'use strict';

  return View.extend({
    template: function(){
      return 'blocks/'+this.model.get('template').get('template');
    },

    events: {
      'click .action-edit': '$edit',
      'click .action-destroy': '$destroy'
    },

    render: function(){
      View.prototype.render.apply(this, arguments);
      this.render2();
      return this;
    },

    render2: function(){
      this.$el.attr('data-block', '');
      this.$el.prepend(JST['block_actions']());
    },

    $edit: function(e){
      new Modal({}).open();
      return this;
    },

    $destroy: function(){
      console.log('destroy');
      this.remove();
    }

  });

});

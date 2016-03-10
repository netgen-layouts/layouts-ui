define(['view'], function(View){
  'use strict';

  return View.extend({
    extend_with: ['browser'],
    template: 'browser/root_item',
    tagName: 'option',

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom();
      return this;
    },

    setup_dom: function(){
      this.$el.attr('data-id', this.model.id);
    }

  });

});

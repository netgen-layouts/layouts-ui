define(['view'], function(View){
  'use strict';

  return View.extend({
    template: function(){
      return 'blocks/'+this.model.get('template').get('template');
    },
    render: function(){
      View.prototype.render.apply(this, arguments);
      this.$el.attr('data-block', '');
      this.$el.prepend('<span class="handle" />');
      return this;
    },
  });

});

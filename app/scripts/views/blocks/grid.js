define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    render: function(){
      var self = this;
      $.get(this.model.get('grid_real'))
        .done(function(resp){
          self.$el.html(resp);
          self.render2();
        });
      return this;
    }
  });
});

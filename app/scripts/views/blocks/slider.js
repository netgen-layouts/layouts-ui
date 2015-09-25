define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    render: function(){
      Base.prototype.render.apply(this, arguments);
      return this.append_slider_options();
    },

    append_slider_options: function(){
      this.$el
        .prepend(JST.slider(this.context));
      return this;
    }

  });

});

define(['./block'], function(Block){
  'use strict';

  return Block.extend({

    render: function(){
      Block.prototype.render.apply(this, arguments);
      return this.append_slider_options();
    },

    append_slider_options: function(){
      this.context.parameters = this.model.param();
      this.$el.prepend(JST.slider(this.context));
      return this;
    }

  });

});

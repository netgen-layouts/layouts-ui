'use strict';

var Block = require('./block');

module.exports = Block.extend({

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

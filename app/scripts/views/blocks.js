define(['view', './block'], function(View, ViewBlock){
  'use strict';

  return View.extend({
    ViewItem: ViewBlock,
    render: function(){
      View.prototype.render.apply(this, arguments);
      this.render_items();
      return this;
    }
  });

});

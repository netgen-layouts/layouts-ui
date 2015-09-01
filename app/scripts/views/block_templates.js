define(['underscore', 'view', './block_template', 'app', './dnd'], function(_, View, ViewBlockTemplate, App, Dnd) {
  'use strict';

  return View.extend(Dnd).extend({
    ViewItem: ViewBlockTemplate,

    render: function() {
      View.prototype.render.apply(this, arguments);
      this.render_items();
      this.dnd();
      return this;
    }

  });

});

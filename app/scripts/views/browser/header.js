define(['underscore', 'view', './header_item'], function(_, View, HeaderItem){
  'use strict';

  return View.extend({

    extend_with: ['browser'],

    ViewItem: HeaderItem,

    prevent_auto_render: true,

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.show_preview_for_first_item();
      return this;
    },

    render: function(){
      View.prototype.render.apply(this, arguments);
      this.select_first_root_locations();
      return this;
    },

    show_preview_for_first_item: function(){
      var model = this.collection.first();
      this.browser.render_preview(model);
    },

    select_first_root_locations: function(){
      this.$('.header-item').first().addClass('selected');
    },

  });

});


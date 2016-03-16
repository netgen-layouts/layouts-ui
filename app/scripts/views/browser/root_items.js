define(['underscore', 'view', './root_item'], function(_, View, RootItem){
  'use strict';

  return View.extend({

    extend_with: ['tabs'],

    ViewItem: RootItem,

    prevent_auto_render: true,

    events : {
    'change' : '$open_root_location'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.show_preview_for_first_item();
      return this;
    },

    show_preview_for_first_item: function(){
      var model = this.collection.first();
      this.tabs.render_preview(model);
    },

    $open_root_location: function(e){
      e.preventDefault();

      var items = this.tabs.collection,
          model = this.$('option:selected').data('_view').model;

      items.fetch_root_model_id(model.id);

      // select root item by id
      this.collection.select_model_by_id(model.id);

      this.show_preview(model);
    },

    show_preview: function(model){
      this.tabs.render_preview(model);
    }

  });

});


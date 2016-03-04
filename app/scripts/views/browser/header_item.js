define(['view'], function(View){
  'use strict';

  return View.extend({

    extend_with: ['browser'],

    template: 'browser/header_item',

    tagName: 'li',

    className: 'header-item',

    events: {
      'click a': 'open_root_location'
    },

    open_root_location: function(e){
      e.preventDefault();

      var locations = this.parent.browser.collection;
      locations.fetch_root_model_id(this.model.id);

      // select root location model and view item
      this.parent.collection.select_model_by_id(this.model.id);
      $('.header-item').removeClass('selected');
      this.$el.addClass('selected');

      this.show_preview();
    },

    show_preview: function(){
      this.parent.browser.render_preview(this.model);
    }

  });

});

define(['app', './breadcrumb_item'], function(App, BreadcrumbItemView){
  'use strict';

  return BreadcrumbItemView.extend({

    $open: function(e){
      e.preventDefault();

      var browse = this.parent.browse;
      browse.render_search_tab(this.model);

    }

  });

});

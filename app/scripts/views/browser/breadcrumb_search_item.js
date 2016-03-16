define(['app', './breadcrumb_item'], function(App, BreadcrumbItemView){
  'use strict';

  return BreadcrumbItemView.extend({

    $open: function(e){
      e.preventDefault();

      var tabs = this.parent.tabs;

      if(this.model.get('name').indexOf('Search for') !== -1){
        tabs.render_search_tab();
        tabs.enable_search_panel();
      }else{
        tabs.render_search_tab(this.model);
        tabs.disable_search_panel();
      }

    }

  });

});

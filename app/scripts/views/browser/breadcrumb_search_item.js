define(['app', 'models/item', './breadcrumb_item'], function(App, Item, BreadcrumbItemView){
  'use strict';

  return BreadcrumbItemView.extend({

    $open: function(e){
      e.preventDefault();

      var tabs = this.parent.tabs;

      if(this.model.get('name').indexOf(Item.BREADCRUMB_TEXT) !== -1){
        tabs.render_search_tab();
        tabs.enable_search_panel();
      }else{
        tabs.render_search_tab(this.model);
        tabs.disable_search_panel();
      }

    }

  });

});

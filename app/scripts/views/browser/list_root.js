define(['view', './list_base'], function(View, ListBase){
  'use strict';

  return View.extend(ListBase).extend({
    browse_tab: function(){
      return this.browse;
    }
  });

});

define(['./list_base'], function(ListBase){
  'use strict';

  return ListBase.extend({
    browse_tab: function(){
      return this.tabs;
    }
  });

});

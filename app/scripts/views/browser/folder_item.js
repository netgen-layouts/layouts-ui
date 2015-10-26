define(['view'], function(View){
  'use strict';

  return View.extend({
    template: 'browser/folder_item',
    tagName: 'li',
    events:{
      'click': 'item_click'
    },

    initialize: function(opts){
      View.prototype.initialize.apply(this, arguments);
      this.browser = opts.browser;
      this.folder = opts.folder;
      return this;
    },

    item_click: function(e){
      var view = $(e.currentTarget).data('_view');
      var model = view.model;
      model.select();
      this.browser.select_item(model, this.folder);
    }
  });

});

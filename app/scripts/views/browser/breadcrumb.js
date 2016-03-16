define(['underscore', 'view', './breadcrumb_item'], function(_, View, BreadcrumbItem){
  'use strict';

  return View.extend({
    extend_with: ['tabs'],
    ViewItem: BreadcrumbItem,
    prevent_auto_render: true,

    initialize: function(options){
      View.prototype.initialize.apply(this, arguments);
      options.ViewItem && (this.ViewItem = options.ViewItem);
    },
  });

});

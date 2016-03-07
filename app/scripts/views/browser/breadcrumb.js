define(['underscore', 'view', './breadcrumb_item'], function(_, View, BreadcrumbItem){
  'use strict';

  return View.extend({
    extend_with: ['browser'],
    ViewItem: BreadcrumbItem,
    prevent_auto_render: true
  });

});

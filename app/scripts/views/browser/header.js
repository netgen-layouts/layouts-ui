define(['underscore', 'view', './header_item'], function(_, View, HeaderItem){
  'use strict';

  return View.extend({
    extend_with: ['browser'],
    ViewItem: HeaderItem,
    prevent_auto_render: true
  });

});


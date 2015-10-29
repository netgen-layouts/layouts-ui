define(['underscore', 'view', './list_item'], function(_, View, ListItem){
  'use strict';

  return View.extend({
    template: 'browser/list',
    extend_with: ['browser'],
    view_items_el: '.items',
    ViewItem: ListItem
  });

});

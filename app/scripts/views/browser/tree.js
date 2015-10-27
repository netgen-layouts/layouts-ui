define(['underscore', 'view', './tree_item'], function(_, View, TreeItem){
  'use strict';

  return View.extend({
    extend_with: ['browser'],
    ViewItem: TreeItem,
    prevent_auto_render: true

  });

});

define(['underscore', 'app', 'view', './selected_item'], function(_, App, View, SelectedItem){
  'use strict';

  return View.extend({
    extend_with: ['browser'],
    ViewItem: SelectedItem
  });

});

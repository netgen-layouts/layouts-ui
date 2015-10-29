define(['underscore', 'view'], function(_, View){
  'use strict';

  return View.extend({
    template: 'browser/list_empty',
    prevent_auto_render: true
  });

});

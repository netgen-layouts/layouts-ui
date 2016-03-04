define(['underscore', 'view'], function(_, View){
  'use strict';

  return View.extend({
    template: 'browser/preview',
    prevent_auto_render: false
  });

});

define(['underscore', 'view', './node_item'], function(_, View, NodeItem){
  'use strict';

  return View.extend({
    template: 'browser/node',
    prevent_auto_render: true

  });

});

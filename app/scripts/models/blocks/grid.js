define(['underscore', 'backbone', './base'], function(_, Backbone, Block){
  'use strict';

  return Block.extend({
    defaults: {
      template: 'grid'
    }
  });

});

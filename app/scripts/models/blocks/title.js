define(['./base'], function(Block){
  'use strict';

  return Block.extend({
    defaults: {
      template: 'title',
      content: 'Title',
      tag: 'h1'
    }
  });

});

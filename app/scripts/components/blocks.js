define(['views/blocks', 'collections/blocks'], function(ViewBlocks, Blocks){
  'use strict';

  var Compontent = new ViewBlocks({
    el: '.blocks',
    collection: new Blocks()
  })

  return Compontent;

});

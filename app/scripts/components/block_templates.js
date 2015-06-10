define(['views/block_templates', 'collections/block_templates'], function(ViewBlockTemplates, BlockTemplates){
  'use strict';

  var Compontent = new ViewBlockTemplates({
    el: '.blocks',
    collection: new BlockTemplates()
  });

  return Compontent;

});

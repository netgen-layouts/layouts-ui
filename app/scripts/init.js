define(['app', 'backbone',  'components/main', 'collections/block_templates', 'views/block_templates'], function(App, Backbone, Components, BlockTemplates, ViewBlockTemplates){
  'use strict';

  $.extend(App, Backbone.Events, {
    init: function(){
      console.log('Hello world');

      App.g.block_templates = new BlockTemplates();

      var view_block_templates = new ViewBlockTemplates({
        el: '.blocks',
        collection: App.g.block_templates
      });


      Components.Zones.collection.fetch();

      view_block_templates.collection.fetch();

    },
  });

  return App;

});

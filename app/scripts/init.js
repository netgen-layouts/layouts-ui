define(['app', 'backbone',  'components/main'], function(App, Backbone, Components){
  'use strict';

  $.extend(App, Backbone.Events, {
    init: function(){
      console.log('Hello world');

      Components.Zones.collection.fetch();
      Components.BlockTemplates.collection.fetch();

    },
  });

  return App;

});

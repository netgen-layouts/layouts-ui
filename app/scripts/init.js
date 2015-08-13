define(['app', 'backbone',  'components/main', 'collections/block_templates', 'views/block_templates', 'models/layout'], function(App, Backbone, Components, BlockTemplates, ViewBlockTemplates, Layout){
  'use strict';

  $.extend(App, Backbone.Events, {



    init: function(){
      console.log('Hello world');

      App.g.block_templates = new BlockTemplates();
      App.g.layout = new Layout({id: $('[data-layout]').data('layout') });

      var view_block_templates = new ViewBlockTemplates({
        el: '.blocks',
        collection: App.g.block_templates
      });


      Components.Zones.collection.fetch();

      view_block_templates.collection.fetch();
      App.g.layout.fetch();

      this.on('sortable:start', function(){
        $(document.body).addClass('sorting');
      }).on('sortable:end', function(){
        $(document.body).removeClass('sorting');
      });


      App.on('positions:update', function() {
        App.g.layout.save({
          positions: App.get_positions()
        });
      });


    },

    get_positions: function(){
      var positions = [], blocks;
      $('[data-zone]').each(function(){
        var zone_id = $(this).data().zone;


        blocks = [];
        $(this).find('[data-view]').each(function(){
          var model = $(this).data('_view').model;
          var block = model.isNew() ? {block_type_id: model.get('template_id')} : {block_id: model.id, block_type_id: model.get('template_id')};

          blocks.push(block);
        });

        positions.push({
          zone: zone_id,
          blocks: blocks
        });

      });

      return positions;
    }
  });


  window.App = App;
  return App;

});

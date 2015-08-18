define(['app', 'backbone',  'components/main', 'collections/block_templates', 'views/block_templates', 'models/layout', 'views/blocks/load'], function(App, Backbone, Components, BlockTemplates, ViewBlockTemplates, Layout, ViewBlocksLoad){
  'use strict';

  $.extend(App, Backbone.Events, {

    blocks: ViewBlocksLoad,

    init: function(){
      this.setup_data();


      $.when(
        App.g.block_templates.fetch(),
        App.g.layout.fetch(),
        Components.Zones.collection.fetch() //TODO: remove this
      ).then(this.start.bind(this));

    },


    setup_data: function(){
      App.g.block_templates = new BlockTemplates();
      App.g.layout = new Layout({id: $('[data-layout]').data('layout') });
    },


    start: function(){

      var view_block_templates = new ViewBlockTemplates({
        el: '.blocks',
        collection: App.g.block_templates
      });



      view_block_templates.render();
      view_block_templates.load_blocks();


      this.on('sortable:start', function(){
        $(document.body).addClass('sorting');
      }).on('sortable:end', function(){
        $(document.body).removeClass('sorting');
      });


      //Debounced with 100ms
      App.onAll('positions:update', function() {
        App.g.layout.save({
          positions: App.get_positions()
        });
      },200);

      $(document).on('dragenter', function(e){
        e.preventDefault();
        $(document.body).addClass('dragging');
      }).on('dragover dragleave', function(e){
        e.preventDefault();
      }).on('drop', function(e){
        e.preventDefault();
        $(document.body).removeClass('dragging');
      });
    },

    get_positions: function(){
      var positions = [], blocks;
      $('[data-zone]').each(function(){
        var zone_id = $(this).data().zone;


        blocks = [];
        $(this).find('> [data-view]').each(function(){
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

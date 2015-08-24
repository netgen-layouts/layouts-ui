define(['app', 'model', 'backbone',  'components/main', 'collections/block_templates', 'views/block_templates', 'models/layout', 'views/blocks/load'], function(App, Model, Backbone, Components, BlockTemplates, ViewBlockTemplates, Layout, ViewBlocksLoad){
  'use strict';


    Backbone.defaults = function(){
      var request = {};

      if(App.env.name === 'staging'){
         request.headers = {
          Authentication: 'Token EffectivaNetgen'
        };
      }

      return request;
    };

  $.extend(App, Backbone.Events, {

    blocks: ViewBlocksLoad,

    init: function(){
      this.setup_events();

      App.g.block_templates = new BlockTemplates();
    },

    setup_events: function(){
      this.on('sortable:start', function(){
        $(document.body).addClass('sorting');
      }).on('sortable:end', function(){
        $(document.body).removeClass('sorting');
      });


      //Debounced with 200ms
      App.onAll('positions:update', function() {
        App.g.layout.save({
          positions: App.get_positions()
        });
      }, 200);

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

    page_layout: function(){
      App.g.layout = new Layout({id: App.router.params.id});

      $.when(
        App.g.block_templates.fetch_once(),
        App.g.layout.fetch()
      ).then(this.start.bind(this));
    },

    start: function(){

      $('.zones').html(App.g.layout.get('html'));

      Components.Zones.collection.reset(App.g.layout.get('zones'));

      var view_block_templates = new ViewBlockTemplates({
        el: '.blocks',
        collection: App.g.block_templates
      });

      view_block_templates.render();
      view_block_templates.load_blocks();

    },

    get_positions: function(){
      var positions = [], blocks;
      $('[data-zone]').each(function(){
        var zone_id = $(this).data().zone;
        var zone_model = $(this).data('_view').model;
        console.log(zone_model);
        blocks = [];
        $(this).find('> [data-view]').each(function(){
          var model = $(this).data('_view').model;
          !model.isNew() && blocks.push({
            block_id: model.id,
            block_type_id: model.get('template_id')
          });
        });

        !zone_model.is_inherited() && positions.push({
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

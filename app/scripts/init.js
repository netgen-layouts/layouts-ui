'use strict';

var Core = require('core_boot');
var Components = require('./components/main');
var BlockTypes = require('./collections/block_types');
var ViewBlockTypes = require('./views/block_types');
var Layout = require('./models/layout');
var ViewBlocksLoad = require('./views/blocks/load');
var ModelHelper = require('./models/blocks/helper');

// browser
var Browser = require('./browser-ui/views/browser');
var TreeConfig = require('./browser-ui/models/tree_config');
var Items = require('./browser-ui/collections/items');

Core.Backbone.defaults = function(){
  var request = {};

  if(Core.env.name === 'staging'){
     request.headers = {
      Authentication: 'Token EffectivaNetgen'
    };
  }

  return request;
};

$.extend(Core, {

  blocks: ViewBlocksLoad,

  model_helper: ModelHelper,

  app_cache_handler: function(){
      window.applicationCache && window.applicationCache.addEventListener('updateready', function() {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
          if (confirm('A new version of this site is available. Load it?')) {
            window.location.reload();
          }
        } else {
          // Manifest didn't changed. Nothing new to server.
        }
      }, false);
  },


  init: function(){
    this.app_cache_handler();
    this.setup_events();

    Core.g.block_types = new BlockTypes();
    Core.g.tree_config = new TreeConfig({
      root_path: 'ezcontent' // ezcontent, ezlocation, eztags
    });
  },

  setup_events: function(){
    this.on('sortable:start', function(){
      $(document.body).addClass('sorting');
    }).on('sortable:end', function(){
      $(document.body).removeClass('sorting');
    });

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
    Core.g.layout = new Layout({id: Core.router.params.id});

    $.when(
      Core.g.block_types.fetch_once(),
      Core.g.layout.blocks.fetch(),
      Core.g.layout.fetch(),
      Core.g.tree_config.fetch()
    ).then(Core.g.tree_config.save_available_columns.bind(Core.g.tree_config)
    ).then(this.start.bind(this));
  },

  start: function(){
    $('.zones').html(Core.g.layout.get('html'));

    Components.Zones.collection.reset(Core.g.layout.get('zones'));

    var view_block_types = new ViewBlockTypes({
      el: '.blocks',
      collection: Core.g.block_type_groups
    });

    view_block_types.render();

    this.blocks.load_layout_blocks();


    $('.right-sidebar').html(JST.sidebar());

    //this.open_browser();
  },

  open_browser: function(){

    var default_location = Core.g.tree_config.default_location();

    var tree_collection = new Items();

    var browser = new Browser({
      tree_collection: tree_collection,
      title: 'Content browser'
    }).on('apply', function(){
      alert(browser.selected_values());
    }).open();

    default_location && tree_collection.fetch_root_model_id(default_location.id);
  },

  get_positions: function(){
    var positions = [], blocks;
    $('[data-zone]').each(function(){
      var zone_id = $(this).data().zone;
      var zone_model = $(this).data('_view').model;
      blocks = [];
      $(this).find('> [data-view]').each(function(){
        var model = $(this).data('_view').model;
        !model.isNew() && blocks.push({
          block_id: model.id
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

window.Core = Core;
module.exports = Core;

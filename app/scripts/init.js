'use strict';

var Core = require('core_boot');
var Components = require('./components/main');
var BlockTypes = require('./collections/block_types');
var ViewBlockTypes = require('./views/block_types');
var Layout = require('./models/layout');
var ViewBlocksLoad = require('./views/blocks/load');
var ModelHelper = require('./models/blocks/helper');
var HeaderView = require('./views/header');

var LayoutTypes = require('./collections/layout_types');
var NewLayoutView = require('./views/new_layout');

// browser
var Browser = require('./browser-ui/views/browser');
var TreeConfig = require('./browser-ui/models/tree_config');
var Items = require('./browser-ui/collections/items');


var Nprogress = require('nprogress');
var _ = require('underscore');

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

    this.on('render plugins:reinitialize', this.reinitialize_plugins);

    Core.g.layout_types = new LayoutTypes();
    Core.g.block_types = new BlockTypes();
  },

  reinitialize_plugins: function(data){
    data.view.$('.xeditable').xeditable();
    data.view.$('.js-dependable-selects-group .js-master').dependable_select();
    data.view.$('.js-input-browse').input_browse();
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
    }).on('click', '.main-content', function(e){
      var $block = $(e.target).closest('[data-block]');
      if($block.length){return;}
      Core.trigger('editing:unmark');
    });

    $(document)
      .ajaxStart(function(){
        Nprogress.start();
      })

      .ajaxStop(function(){
       _.delay(Nprogress.done, 100);
      });

  },

  page_layout: function(){
    Core.g.layout = new Layout({id: parseInt(Core.router.params.id, 10)});
    $.when(
      Core.g.block_types.fetch_once(),
      Core.g.layout.blocks.fetch(),
      Core.g.layout.fetch()
    ).then(this.start.bind(this));
  },

  page_layout_new: function(){
    console.log('hello layout_new');

    var layout = new Layout();

    var layout_view = new NewLayoutView({
      url: '/bm/app/layouts/form/create',
      model: layout
    });


    $.when(
      Core.g.layout_types.fetch()
    ).then(
      layout_view.render().open()
    );



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

    new HeaderView({model: Core.g.layout, el: '.app-header'});

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

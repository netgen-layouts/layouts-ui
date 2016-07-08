'use strict';

var Core = require('core_boot');
var BlockTypes = require('./collections/block_types');
var Layout = require('./models/layout');
var ViewBlocksLoad = require('./views/blocks/load');
var ModelHelper = require('./models/blocks/helper');
var Router = require('./router');

var LayoutTypes = require('./collections/layout_types');
var NewLayoutView = require('./views/new_layout');

// browser
var Browser = require('./browser-ui/views/browser');
var TreeConfig = require('./browser-ui/models/tree_config');
var Items = require('./browser-ui/collections/items');

var Config = require('./models/config');
var Layouts = require('./collections/layouts');


var Nprogress = require('nprogress');
var _ = require('underscore');

Core.Backbone.defaults = function(){
  var request = {};

  request.headers = {
    'X-CSRF-Token': Core.g.config.get('csrf_token')
  };

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
    Core.g.config = new Config();
    Core.g.shared_layouts = new Layouts();


    $(function(){
      Core.router = new Router();
      Core.Backbone.history.start();
    });

  },

  hide_selects_with_one_option: function(view){
    view.$('select').each(function(){
      var alone = $('option', this).length <= 1;
      alone && $(this).parent().addClass('alone');
    });
    return this;
  },

  reinitialize_plugins: function(data){
    data.view.$('.xeditable').xeditable();
    data.view.$('.js-dependable-selects-group .js-master').dependable_select();
    data.view.$('.master-slave-selects .master').master_slave_selects();
    data.view.$('.js-input-browse').input_browse();
    data.view.$('.js-external-video').video_thumb_fetcher();


    this.hide_selects_with_one_option(data.view);

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
      })

      .ajaxError(function(e, xhr, ajaxSettings, error ){

        if(xhr.status === 403){

          new Core.Modal({
            title:  'Session timeout',
            body: 'Press OK to refresh the page',
            cancel_disabled: true,
            modal_options: {
              keyboard: false,
              backdrop: 'static'
            }
          }).on('apply', function(){
            window.history.go(0);
          }).open();

        }

      })

  }

});

window.Core = Core;
module.exports = Core;

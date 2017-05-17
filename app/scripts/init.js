'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var BlockTypes = require('./collections/block_types');
var ViewBlocksLoad = require('./views/blocks/load');
var ModelHelper = require('./models/blocks/helper');
var Router = require('./router');

var LayoutTypes = require('./collections/layout_types');


var Config = require('./models/config');
var State = require('./models/state');
var Layouts = require('./collections/layouts');

var LocalConfig = require('./models/local_config');

var Nprogress = require('nprogress');
var _ = require('underscore');

Core.Backbone.defaults = function(){
  var request = {};

  request.headers = {
    'X-CSRF-Token': Core.g.config.get('csrf_token')
  };

  return request;
};


Core.default_context = function() {
  return {
    state: this.state
  };
};

_.extend(Core, {

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
    //this.app_cache_handler();

    this.on('render plugins:reinitialize', this.reinitialize_plugins);

    Core.g.layout_types = new LayoutTypes();
    Core.g.block_types = new BlockTypes();
    Core.g.config = new Config();
    Core.g.local_config = new LocalConfig({id: 1});
    Core.g.local_config.fetch();
    Core.g.shared_layouts = new Layouts();
    Core.state = new State({
      mode: 'edit',
      section: 'normal'
    });
    this.setup_events();

    $(function(){
      Core.load_additional_vars();
      Core.router = new Router();
      Core.Backbone.history.start();
    });

  },

  load_additional_vars: function(){
    var bm_base_path = $('meta[name="ngbm-base-path"]').attr('content');
    bm_base_path && (Core.env.bm_base_path = bm_base_path);
  },


  hide_selects_with_one_option: function(view){
    view.$('select').each(function(){
      if (!$(this).hasClass('js-always-show')) {
          var alone = $('option', this).length <= 1;
          alone && $(this).parent().addClass('alone');
      }
    });
    return this;
  },

  reinitialize_plugins: function(data){
    data.view.$('.xeditable').xeditable();
    data.view.$('.js-dependable-selects-group .js-master').dependable_select();
    data.view.$('.master-slave-selects .master').master_slave_selects();
    data.view.$('.js-input-browse').input_browse();
    data.view.$('.js-multiple-browse').multiple_browse();
    data.view.$('.js-external-video').video_thumb_fetcher();
    data.view.$('.view-type').view_types();


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
            body: 'Your session has timed out. Please hit the refresh button to reload the application.',
            apply_text: 'Refresh',
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


    $(document).on('click', 'a[href="#"]', function(e){
      e.preventDefault();
    })


    Core.state.on('change', function(model) {
      $('.right-sidebar').html(JST[model.detect_sidebar()]());
    });

  }

});

window.Core = Core;

module.exports = Core;

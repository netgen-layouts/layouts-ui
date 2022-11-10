'use strict';

var Core = require('./core');
var Env = require('./environments/default');
var $ = Core.$;
var BlockTypes = require('./collections/block_types');
var ViewBlocksLoad = require('./views/blocks/load');
var ModelHelper = require('./models/blocks/helper');
var Router = require('./router');

var LayoutTypes = require('./collections/layout_types');

var Browser = require('@netgen/content-browser-ui');

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


var ajax_errors = {};


Core.default_context = function() {
  return {
    state: this.state
  };
};

var debounced_display_errors = _.debounce(function(){
  Core.display_errors();
}, 250);

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
    $(document).ajaxSend(function(e, xhr, ajaxSettings, error ){
      xhr.uid = _.uniqueId();
      ajax_errors[xhr.uid] = xhr;
      xhr.opts = {
        timestamp: new Date(),
        type: ajaxSettings.type,
        url: ajaxSettings.url
      };

      xhr.success(function(){
        delete(ajax_errors[xhr.uid]);
      });

    }).ajaxError(function(e, xhr, ajaxSettings, error ){
      var url = xhr.opts.url;
      var status = xhr.status;
      var handle_draft = status === 404 &&
                        (url.match(/\/layouts\/[\w-]+\?published=false/) || url.match(/\/layouts\/[\w-]+\/draft/));

      //Skip global error message for following errors
      if(status === 403 || handle_draft){
        delete(ajax_errors[xhr.uid]);
      }
      debounced_display_errors();
    })

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


    Core.g.local_config.on('change:ngldev', function (m, s) {
      $('#app')[s ? 'addClass' : 'removeClass']('ngldev');
    })

    $(function(){
      Core.load_additional_vars();
      Core.router = new Router();
      Core.Backbone.history.start();
      Core.dm() && $('#app').addClass('ngldev');
    });

    $(document).on('dblclick', '.app-logo-box', this.tdm);

    window.addEventListener('beforeunload', function (e) {
      if (Core.should_navigate_away || process.env === 'development') return null; // don't show prompt if publishing, discarding or in dev mode
      var confirmationMessage = 'There could be unsaved changes. Are you sure you want to leave?';

      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    });
  },

  dm: function() {
    return Core.g.local_config.get('ngldev');
  },

  tdm: function() {
    Core.g.local_config.save({ngldev: !Core.dm() });
  },


  load_additional_vars: function(){
    var bm_base_path = $('meta[name="nglayouts-base-path"]').attr('content');
    bm_base_path && (Env.bm_base_path = bm_base_path);
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

  reinitialize_plugins: function(data) {
    data.view.$('.xeditable').xeditable();
    data.view.$('.js-dependable-selects-group .js-master').dependable_select();
    data.view.$('.master-slave-selects .master').master_slave_selects();
    Array.prototype.forEach.call(document.getElementsByClassName('js-input-browse'), function(el) {
      return new Browser.InputBrowse(el);
    });
    Array.prototype.forEach.call(document.getElementsByClassName('js-multiple-browse'), function(el) {
      return new Browser.MultipleBrowse(el);
    });

    data.view.$('.js-external-video').video_thumb_fetcher();
    data.view.$('.view-type').view_types();
    data.view.$('.ngl-tooltip').bm_tooltip();


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
        _.delay(function(){
          if ($.active === 0){
            Nprogress.done();
          }
        }, 100);
      })

      .ajaxError(function(e, xhr, ajaxSettings, error ){
        if (Core.error_displayed) return true;
        Core.error_displayed = true;
        var title, body, on_apply,
            apply_text = 'Refresh',
            on_apply = function(){
              window.history.go(0);
            };

        if(xhr.status === 403){
          if (xhr.opts.type === 'GET') {
            title = 'Not allowed';
            body = 'You don\'t have permission to edit this layout.';
            apply_text = 'OK';
            on_apply = function() {
              Core.should_navigate_away = true;
              location.href = localStorage.getItem('ngl_referrer') || '/';
            };
          } else {
            title =  'Session timeout';
            body = 'Your session has timed out. Please hit the refresh button to reload the application.';
          }
        }

        if(xhr.status === 404 && xhr.opts.url.match(/\/layouts\/[\w-]+\/draft/)){
          title =  'Layout does not exist';
          body = 'Layout you are trying to edit does not exist.';
          on_apply = function () {
            Core.router.navigate_to('layout_new');
          }
          apply_text = "Create new layout"
        }

        if(title){
         new Core.Modal({
            title:  title,
            body: body,
            apply_text: apply_text,
            cancel_disabled: true,
            modal_options: {
              keyboard: false,
              backdrop: 'static'
            }
          }).on('apply', on_apply).open();
        } else if(xhr.status !== 404) {
          Core.error_displayed = false;
          ajax_errors[xhr.uid] = xhr;
        }


      });


    $(document).on('click', 'a[href="#"]', function(e){
      e.preventDefault();
    });


    Core.state.on('change', function(model) {
      $('.right-sidebar').html(JST[model.detect_sidebar()]());
    });

    this.on("loading-overlay:show", function(){
      $(".loading-overlay").show();
    })

    this.on("loading-overlay:hide", function(){
      $(".loading-overlay").hide();
    })

  },

  display_errors: function(){
    if (Core.error_displayed) return true;
    Core.error_displayed = true;
    var body,
        errors = [];

    _.map(ajax_errors, function(xhr) {
      var json = xhr.responseJSON;
      json && errors.push(
        _.extend({
          pretty_debug: JSON.stringify(json.debug, null, 2),
        }, json, xhr.opts)
      );
    });

    body = JST.error_message({errors: errors});

    if(!errors.length){return;}
    new Core.Modal({
      title:  'Something went wrong!',
      body: body,
      apply_text: 'Refresh',
      cancel_disabled: true,
      modal_options: {
        keyboard: false,
        backdrop: 'static'
      }
    }).on('apply', function(){
      window.history.go(0);
    }).open();
      return this;
    },

});



window.onerror = function() {
  Core.display_errors();
  _.delay(Nprogress.done, 100);
  return false;
}

window.Core = Core;

module.exports = Core;

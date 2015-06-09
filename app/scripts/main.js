'use strict';

require.config({
  baseUrl: 'scripts',

  paths: {
    modernizr: '../../bower_components/modernizr/modernizr',
    underscore: '../../bower_components/underscore/underscore',
    requirejs: '../../bower_components/requirejs/require',
    moment: '../../bower_components/moment/moment',
    jquery: '../../bower_components/jquery/dist/jquery',
    handlebars: '../../bower_components/handlebars/handlebars',
    'backbone.localstorage': '../../bower_components/backbone.localstorage/backbone.localStorage',
    backbone_original: '../../bower_components/backbone/backbone',
    backbone: './extended/backbone_override',
    register_helpers: './register_helpers',
    templates: 'templates',
    app: 'app',
    init: 'init'
  },

  shim: {

    handlebars: {
      exports: 'Handlebars',

      init: function() {
        this.Handlebars = Handlebars; /*jshint ignore:line */ //NOTE: dont write window.Handlebars here it causes build bug
        return this.Handlebars;
      }
    },


    templates: {
      deps: ['register_helpers']
    }

  }
});

require(['init', 'jquery'], function(App) {
  App.init();
});

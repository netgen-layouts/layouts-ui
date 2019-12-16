'use strict';

var Core = require('../core');
var Env = require('../environments/default');
var $ = Core.$;
var moment = require('moment');
require('moment/min/locales.min');
var _ = require('underscore');

module.exports = Core.View.extend({

  extend_with: ['base_layout'],

  template: 'header',

  events: {
    'submit form.js-layout': 'set_name',
    'click .js-show-form': 'open_edit_name',
    'click .js-publish': 'publish_layout',
    'click .js-publish-and-continue': 'publish_and_continue',
    'click .js-save-and-close': 'save_and_close',
    'click .js-discard': 'discard_draft',
    'click .js-normal-mode': '$normal_mode',
    'click .js-back': '$back',
    'click .js-soft-back': '$soft_back',
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.render);
    this.listenTo(this.model, 'draft:success', this.render);
    this.listenTo(this.model, 'draft:success', this.enable_edit);
    this.listenTo(this.model, 'publish:success discard:success', this.close_layout);
    this.listenTo(this.model, 'change:description change:name', this.render);

    return this;
  },

  render: function(){
    this.context.layouts_version = Core.g.version;
    this.context.normal_editing = Core.state.in_mode('edit', 'edit_shared', 'preview');
    Core.View.prototype.render.apply(this, arguments);
    this.$name_input = this.$('.js-name');
    this.setPageTitle();

    return this;
  },


  $back: function() {
    if(Core.state.in_mode('choosing')){
      Core.router.navigate_to('layout', {type: 'link', id: this.model.id});
    }else{
      Core.router.navigate_to('layout', {type: 'edit', id: this.model.id});
    }

  },

  $soft_back: function() {
    Core.state.set({mode: 'edit', section: 'edit'});
    Core.router.navigate_to_params({type: 'edit'}, {trigger: false});
  },

  $edit_mode: function() {
    var id = this.model.id;
    Core.g.layout.load_all_blocks().done(function() {
      Core.router.navigate_to('layout', {id: id, type: 'edit'});
    })
  },


  $normal_mode: function(){
    Core.router.navigate_to_params({type: 'edit', locale: null});
  },

  set_name: function(e){
    e.preventDefault();
    this.model.save(this.serialize().params, {patch: true});
  },

  open_edit_name: function(){
    return new Core.ModalForm({
      url: Env.bm_app_url('layouts/' + this.model.id +  '/form/edit'),
      model: this.model
    }).render().open();
  },

  enable_edit: function(){
    Core.trigger("loading-overlay:hide")
  },

  publish_layout: function(e){
    e.preventDefault();
    this.pre_publish(this.model.publish.bind(this.model));
  },

  publish_and_continue: function(e){
    e.preventDefault();
    // Core.router.navigate_to('layout', { type: 'publish', id: this.model.id}, {trigger: false});

    this.pre_publish(this.model.publish_and_continue.bind(this.model));
  },

  pre_publish: function(continueFunction) {
    var self = this;
    Core.trigger("loading-overlay:show");
    if (Core.g.config.get('automatic_cache_clear') !== true) {
      return new Core.Modal({
        title: 'Cache clearing',
        body: 'Automatic cache clear for this site is turned off. Do you want to clear caches after publish?',
        apply_text: 'Clear caches',
        cancel_text: 'Do not clear caches',
        modal_options: {
          keyboard: false,
          backdrop: 'static'
        }
      }).on('apply', function(){
        self.start_publish(continueFunction, {clearCache: true});
      }).on('cancel', function(){
        self.start_publish(continueFunction);
      }).open();
    } else {
      self.start_publish(continueFunction);
    }
  },

  start_publish: function(continueFunction, options){
    setTimeout(function(){
      if ($.active === 0) {
        continueFunction(options);
        return;
      }

      var intervalId = setInterval(function() {
        if ($.active === 0){

          clearInterval(intervalId);
          continueFunction(options);
        }
      }.bind(this), 100)
    }, 1000);
  },

  save_and_close: function(e){
    e.preventDefault();
    this.close_layout()
  },

  discard_draft: function(e){
    e.preventDefault();
    var self = this;
    return new Core.Modal({
      title: 'Discard changes',
      body: 'Are you sure you want to discard your changes to the layout draft?',
      apply_text: 'Discard'
    }).on('apply', function(){
      self.model.discard();
    }).open();
  },

  close_layout: function(where){
    if(Core.state.in_mode('edit_master')){
      Core.router.navigate_to('layout', {id: Core.router.params.draft_layout_id, type: 'edit'});
    }else{
      Core.should_navigate_away = true;
      location.href = localStorage.getItem('ngl_referrer') || '/';
    }

  },

  setPageTitle: function(){
    document.title = this.model.get('name') + ' - Netgen Layouts';
  },

});

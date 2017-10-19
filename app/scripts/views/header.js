'use strict';

var Core = require('netgen-core');
var _ = require('underscore');

module.exports = Core.View.extend({

  extend_with: ['base_layout'],

  template: 'header',

  events: {
    'submit form.js-layout': 'set_name',
    'click .js-show-form': 'open_edit_name',
    'click .js-publish': 'publish_layout',
    'click .js-discard': 'discard_draft',
    'click .js-normal-mode': '$normal_mode',
    'click .js-back': '$back',
    'click .js-soft-back': '$soft_back'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(Core.state, 'change', this.render);
    this.listenTo(this.model, 'draft:success', this.render);
    this.listenTo(this.model, 'publish:success discard:success', this.close_layout);
    this.listenTo(this.model, 'change:description change:name', this.render);

    return this;
  },

  render: function(){
    this.context.normal_editing = Core.state.in_mode('edit', 'edit_shared');
    Core.View.prototype.render.apply(this, arguments);
    this.$name_input = this.$('.js-name');
    this.setPageTitle();
    //this.prevent_leave_page();
    return this;
  },


  $back: function() {
    Core.router.navigate_to('layout', {type: 'link', id: this.model.id});
  },


  $soft_back: function() {
    Core.state.set({mode: 'edit', section: 'edit'});
    Core.router.navigate_to_params({type: 'edit'}, {trigger: false});
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
      url: Core.env.bm_app_url('layouts/' + this.model.id +  '/form/edit'),
      model: this.model
    }).render().open();
  },

  publish_layout: function(e){
    e.preventDefault();
    this.model.publish();
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

  close_layout: function(){
    this.can_leave_page = true;
    if(Core.state.in_mode('edit_master')){
      Core.router.navigate_to('layout', {id: Core.router.params.draft_layout_id, type: 'edit'});
    }else{
      location.href = localStorage.getItem('bm_referrer') || '/';
    }

  },

  can_leave_page: false,

  prevent_leave_page: function(){
    var self = this;
    window.addEventListener('beforeunload', function(e){
      if (!self.can_leave_page){
        var dialogText = 'Are you sure you want to leave the page?';
        e.returnValue = dialogText;
        return dialogText;
      }
    });
  },

  setPageTitle: function(){
    document.title = this.model.get('name') + ' - Netgen Layouts';
  },

});

'use strict';

var Core = require('netgen-core');

module.exports = Core.View.extend({

  template: 'translate_header',

  events: {
    'change': '$load_layout',
    'click .js-new-translation': '$new_translation',
    'click .js-set-main-language': '$set_main_language',
    'click .js-remove-translations': '$remove_translations'
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.model = Core.g.layout;
    console.log(this.model);
    this.listenTo(Core.state, 'change', this.on_state);
    this.on_state();
    this.context.languages = [
      { id: 'en', name: 'Engleski (main)'},
      { id: 'hr', name: 'Hrvatski'}
    ];
    return this;
  },



  $load_layout: function() {
    Core.router.navigate_to_params(this.serialize().params.layout);
  },


  on_state: function(){
    if(Core.state.in_mode('translate')){
      this.render().$el.show();
    }else{
      this.$el.empty().hide();
    }
    return this;
  },


  $new_translation: function(){
    //TODO: change this to configure translation form
    new Core.ModalForm({
      url: Core.env.bm_app_url('layouts/form/create'),
      model: this.model,
      on_success: function(resp) {
        this.close();
        Core.router.navigate_to_params({id: resp.id});
      }
    }).render().open();
  },


  $set_main_language: function(){
    //TODO: change this to configure translation form
    new Core.ModalForm({
      url: Core.env.bm_app_url('layouts/form/create'),
      model: this.model,
      on_success: function(resp) {
        this.close();
        Core.router.navigate_to_params({id: resp.id});
      }
    }).render().open();
  },


  $remove_translations: function(){
    //TODO: change this to configure translation form
    new Core.ModalForm({
      url: Core.env.bm_app_url('layouts/form/create'),
      model: this.model,
      on_success: function(resp) {
        this.close();
        Core.router.navigate_to_params({id: resp.id});
      }
    }).render().open();
  },

});

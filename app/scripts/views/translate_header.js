'use strict';

var Core = require('netgen-core');
var _ = Core._;

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


    this.context.languages = _.map(this.model.get('available_locales'), function(v,k) {
      var main = this.model.get('main_locale') === k ? '(main) ' : '';
      return {id: k, name: main + v};
    }.bind(this));



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
    new Core.ModalForm({
      url: Core.env.bm_app_url('layouts/'+this.model.id+'/form/add_locale'),
      model: this.model,
      on_success: function(resp) {
        console.log(resp);
        this.close();
        Core.router.navigate_to_params({ locale: resp.locale, t: +new Date});
      }
    }).render().open();
  },


  $set_main_language: function(){
    new Core.ModalForm({
      url: Core.env.bm_app_url('layouts/'+this.model.id+'/form/main_locale'),
      model: this.model,
      on_success: function(resp) {
        this.close();
        this.model.trigger('change')
        Core.router.navigate_to_params({ t: +new Date});
      }
    }).render().open();
  },


  $remove_translations: function(){
    new Core.ModalForm({
      url: Core.env.bm_app_url('layouts/'+this.model.id+'/form/remove_locale'),
      model: this.model,
      on_success: function(resp) {
        this.close();
        Core.router.navigate_to_params({locale: this.model.get('main_locale'), t: +new Date});
      }
    }).render().open();
  },

});

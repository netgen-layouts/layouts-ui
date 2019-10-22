'use strict';

var Core = require('../core');
var $ = Core.$;
var LayoutBasePage = require('./layout_base');
var HeaderView = require('../views/header');
var ZoneLinkingHeaderView = require('../views/zone_linking_header');


module.exports = LayoutBasePage.extend({
  main: function(params, xhr){
    $(document.body).removeClass('new_layout');
    LayoutBasePage.prototype.main.apply(this, arguments);

    var layout = Core.g.layout;

    if(Core.router.params.type === 'link'){
      Core.state.set({mode: 'linking', section: 'linking'});
    }else if(Core.router.params.type === 'translate'){
      Core.state.set({mode: 'translate', section: 'translate'});
    }else{
      Core.state.set({mode: Core.g.layout.get('shared') ? 'edit_shared' : 'edit', section: 'edit'});
    }

    new ZoneLinkingHeaderView({
      el: '#zone_linking_header'
    }).render();

    new HeaderView({
      model: Core.g.layout,
      base_layout: this.base_layout,
      el: '.app-header',
    }).render();

    if(!layout.request.read.published && !layout.has('type')){
      this.create_new_draft();
      return;
    }

    if(layout.get('published')){
      this.create_new_draft();
      return;
    }


    if(!layout.get('published') && layout.get('has_published_state') && !params.type){
      this.render_modal(layout);
      return;
    }


    Core.g.layout.load_all_blocks();



    return this;
  },


  render_modal: function(model){
    new Core.Modal({
        template: 'modal_discard_or_edit',
        title:  'What would you like to do with the draft?',
        model: model,
        modal_options: {
          keyboard: false,
          backdrop: 'static'
        }
      })

      //Edit
      .on('cancel', function(){
        Core.router.navigate_to_params({type: 'edit'}, {trigger: false });
        Core.g.layout.load_all_blocks();
      }.bind(this))

      //Discard
      .on('apply', function(){
        this.create_new_draft();

      }.bind(this))
      .open();
  },


  create_new_draft: function(){
    Core.router.navigate_to_params({type: 'create_new_draft'}, {trigger: false});
    Core.g.layout.create_new_draft().done(function() {
      Core.router.navigate_to_params({type: 'edit'});
    });
    return this;
  },



});

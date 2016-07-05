'use strict';

var LayoutBasePage = require('./layout_base');

module.exports = LayoutBasePage.extend({
  main: function(params, xhr){
    console.log(params);

    if(params.type === 'new'){
      Core.router.navigate_to('layout', {id: 1}, {trigger: false});
    }

    LayoutBasePage.prototype.main.apply(this, arguments);

    var layout = Core.g.layout;

    if(layout.get('has_published_state') && !layout.get('published')){
      this.create_new_draft();
      return;
    }


    if(!layout.get('published') && layout.get('has_published_state') && params.type !== 'new'){
      this.render_modal();
      return;
    }


    this.load_blocks();



    return this;
  },


  render_modal: function(){
    new Core.Modal({
        template: 'modal_discard_or_edit',
        title:  'Layout conflict?',
        body: 'Edit existing or existing',
        modal_options: {
          keyboard: false,
          backdrop: 'static'
        }
      })
      .on('cancel', function(){
        this.load_blocks();
      }.bind(this))
      .on('apply', function(){
        this.discard_draft_and_edit_new_one();
      }.bind(this))
      .open();
  },

  load_blocks: function(){
    Core.g.layout.blocks.fetch();
  },

  discard_draft_and_edit_new_one: function(){

    Core.g.layout.create_new_draft().done(function() {
      Core.router.navigate_to('layout', {id: Core.g.layout.id, type: 'new'}, {replace: true});
    })
    return this;
  },


  create_new_draft: function(){
    Core.g.layout.create_new_draft().done(function() {
      Core.router.navigate_to('layout', {id: Core.g.layout.id, type: 'new'}, {replace: true});
    })
    return this;
  },



});

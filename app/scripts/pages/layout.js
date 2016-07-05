'use strict';

var LayoutBasePage = require('./layout_base');

module.exports = LayoutBasePage.extend({
  main: function(params, xhr){
    LayoutBasePage.prototype.main.apply(this, arguments);

    var layout = Core.g.layout;

    // if(params.type === 'new'){
    //   Core.router.navigate_to('layout', {id: 1}, {trigger: false});
    // }

    if(layout.get('published')){
      this.create_new_draft();
      return;
    }


    if(!layout.get('published') && layout.get('has_published_state') && !params.type){
      this.render_modal(layout);
      return;
    }


    this.load_blocks_and_go_to_edit_mode();

    return this;
  },


  render_modal: function(model){
    new Core.Modal({
        template: 'modal_discard_or_edit',
        title:  'What would you like to do with draft?',
        model: model,
        modal_options: {
          keyboard: false,
          backdrop: 'static'
        }
      })

      //Edit
      .on('cancel', function(){
        this.load_blocks_and_go_to_edit_mode();
      }.bind(this))

      //Discard
      .on('apply', function(){
        this.create_new_draft();
      }.bind(this))
      .open();
  },

  load_blocks_and_go_to_edit_mode: function(){
    Core.router.navigate_to('layout', {id: Core.g.layout.id, type: 'edit'}, {trigger: false });
    Core.g.layout.blocks.fetch();
  },


  create_new_draft: function(){
    Core.g.layout.create_new_draft().done(function() {
      this.load_blocks_and_go_to_edit_mode()
    }.bind(this));
    return this;
  },



});

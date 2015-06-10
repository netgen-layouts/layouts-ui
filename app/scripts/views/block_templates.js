define(['view', './block_template', 'models/block', './block'], function(View, ViewBlockTemplate, Block, ViewBlock) {
  'use strict';

  return View.extend({
    ViewItem: ViewBlockTemplate,
    render: function() {
      View.prototype.render.apply(this, arguments);
      this.render_items();
      this.dnd();
      return this;
    },


    dnd: function() {

      $('[data-zone]').sortable({
        connectWith: '[data-zone]',
        placeholder: 'no-placeholder',
        // forceHelperSize: true,
        helper: function(e, item){
          var view = $(item).data('_view');
          console.log(view);
          var helper = $('<div>'+view.model.template().get('name')+'</div>');
          helper.css({'width': '100px', 'height': '100px'});
          return helper;
        },

start: function( event, ui ) {
    $( this ).sortable( 'refreshPositions' )
  },

        stop: function(){
          console.log('STOP', this, arguments);
        },
        receive: function(e, ui) {
          console.log('receive', this, arguments);

          var zone_view = $(this).data('_view');
          var block_template_view = $(ui.item).data('_view');
          var block_template = block_template_view.model;
          var block = block_template.has('template_id') && block_template;
          var zone = zone_view.model;


          console.log(block);

          // if(block){
          //   console.warn('cancel')
          //   $(ui.sender).sortable('cancel');
          //   return false;
          // }


          console.log(zone.should_accept(block_template));
          if(zone.is_inherited()){
            $(ui.sender).sortable('cancel');
            return false;
          }
          if(!zone.should_accept(block_template)){
            $(ui.sender).sortable('cancel');
            return;
          }


          ui.sender.data('copied', true);




          if(block){

          }else{
            block = new Block({
              template_id: block_template.id
            });

            var view_block = new ViewBlock({
              model: block
            });
            ui.item.after(view_block.render().$el);
            ui.item.remove();
          }



        }
      });

      $('.blocks').sortable({
        connectWith: '[data-zone]',
        placeholder: 'no-placeholder',
        receive: function(e, ui){
          console.log(ui.sender, this);
        },

        helper: function (e, item) {
            this.copyHelper = item.clone(true).insertAfter(item);
            $(this).data('copied', false);
            return item.clone();
        },

        stop: function (e) {
            var copied = $(this).data('copied');

            if(!copied){
              e.preventDefault();
              this.copyHelper.remove();
            }
            this.copyHelper = null;
        }
      });

      return this;
    }



  });

});

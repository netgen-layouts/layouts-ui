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
      //   $('#example-1-4 .sortable-list').sortable({
      //     connectWith: '#example-1-4 .sortable-list',
      //     containment: '#containment'
      // });

      $('[data-zone]').sortable({
        connectWith: '[data-zone]',
        placeholder: 'no-placeholder',
        helper: function(e, item){
          var view = $(item).data('_view');
          console.log(view);
          return '<div>'+view.model.get('type').get('name')+'</div>';
        },
        receive: function(e, ui) {

          ui.sender.data('copied', true);


          var view = $(ui.item).data('_view');

          var block = new Block({
            type: view.model
          });

          var view_block = new ViewBlock({
            model: block
          });
          ui.item.after(view_block.render().$el);
          ui.item.remove();

          $('.blocks').sortable( "refresh" );
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

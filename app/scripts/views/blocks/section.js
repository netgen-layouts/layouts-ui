define(['./base', 'app'], function(Base, App){
  'use strict';

  return Base.extend({
    form_namespace: 'section',

    render: function() {
      Base.prototype.render.apply(this, arguments);
      this.dnd();
      return this;
    },

    dnd: function(){
      var self = this;

      this.$('[data-section]').sortable({
        connectWith: '.blocks',
        placeholder: 'no-placeholder',
        receive: function(e, ui){
          console.log('receive', this, arguments);

          var section_view = self.$el.data('_view');

          var block_template_view = $(ui.item).data('_view');
          var block_template = block_template_view.model;
          var block = block_template.has('template_id') && block_template;
          var section = section_view.model;

          console.log('section model', section.attributes);
          console.log('block model', block_template.attributes);
          console.log('block', block);

          ui.sender.data('copied', true);

          if(block){

          }else{
            block = App.model_helper.init_block(block_template, {
              template_id: block_template.id
            });

            var view_block = App.blocks.create_view(block.template().get('kind'), block);

            if(block.is_group()){
              block.save_group();
            }else{
              block.save();
            }

            ui.item.after(view_block.render().$el);
            ui.item.remove();
          }

        },

        // helper: function (e, item) {
        //     this.copyHelper = item.clone(true).insertAfter(item);
        //     $(this).data('copied', false);
        //     return item.clone();
        // },

        start: function( event, ui ) {
          App.trigger('sortable:start');
          $(this).sortable( 'refreshPositions' );
        },

        stop: function(){
          App.trigger('sortable:end');
          App.trigger('positions:update');
          console.log('STOP', this, arguments);
        },
      });

      return this;
    }
  });
});

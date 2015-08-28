define(['underscore', './base', 'app'], function(_, Base, App){
  'use strict';

  return Base.extend({
    form_namespace: 'section',

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.on('render', this.load_blocks);
      return this;
    },

    load_blocks: function(){
      App.blocks.load_section_blocks(this);
    },

    render: function() {
      Base.prototype.render.apply(this, arguments);
      this.dnd();
      return this;
    },

    dnd: function(){
      var self = this;

      this.$('[data-section]').sortable({
        connectWith: '.blocks, [data-zone]',
        placeholder: 'no-placeholder',
        receive: function(e, ui){
          console.log('section receive', this, arguments);

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

            self.listenToOnce(block, 'save:success', self.save_positions);
          }

        },

        start: function( event, ui ) {
          App.trigger('sortable:start');
          $(this).sortable('refreshPositions');
        },

        stop: function(){
          App.trigger('sortable:end');
          App.trigger('positions:update');
          console.log('STOP', this, arguments);
          self.save_positions();
        }

      });

      return this;
    },

    save_positions: function(){
      var positions = [];
      this.$('[data-type]').each(function(i, item){
        var model = $(item).data('_view').model;
        console.log(model.attributes);
        positions.push({
          block_id: model.id,
          block_type_id: model.get('template_id')
        });
      });

      this.model.save({
        positions: positions
      });
    }
  });
});

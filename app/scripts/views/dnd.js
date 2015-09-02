define(['underscore', 'view', 'app'], function(_, View, App){
  'use strict';

  return {

    sort_element: '[data-zone]',
    connect_with: '[data-zone], [data-section]',

    is_zone: function(){
      return this.sort_element === '[data-zone]';
    },

    dnd: function(){
      var self = this,
      $sort_element = this.is_zone() ? $(this.sort_element) : this.$(this.sort_element);

      $sort_element.sortable({
        connectWith: self.connect_with,
        placeholder: 'no-placeholder',
        handle: '.handle',
        tolerance: 'pointer',
        cursorAt: { left: 5 },
        delay: 150,
        distance: 20,
        receive: function(e, ui){
          console.log('base receive', this, arguments);

          var block_template_view = $(ui.item).data('_view');
          var block_template = block_template_view.model;
          var block = block_template.has('template_id') && block_template;
          var receiver_block = $(this).closest('[data-view]').data('_view');
          console.log('receiver_block', receiver_block);

          if(self.is_zone()){
            var zone_view = $(this).data('_view');
            var zone = zone_view.model;

            if(zone.is_inherited()){
              $(ui.sender).sortable('cancel');
              return false;
            }
            if(!zone.should_accept(block_template)){
              $(ui.sender).sortable('cancel');
              return;
            }
          }

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

            ui.item.after(view_block.setup_dom_element().$el);
            ui.item.remove();

          }

        },

        start: function(event, ui) {
          App.trigger('sortable:start');
          $(this).sortable('refreshPositions');
        },

        stop: function(){
          App.trigger('sortable:end');
          if(self.is_zone()){
            App.trigger('positions:update');
          }else{
            App.trigger('block:move');
          }
        }

      });

      if(self.is_zone()){
        $('.blocks').sortable({
          connectWith: '[data-zone], [data-section]',
          placeholder: 'no-placeholder',
          receive: function(e, ui){
            console.log(ui.sender, this);
          },

          helper: function (e, item) {
              this.copyHelper = item.clone(true).insertAfter(item);
              $(this).data('copied', false);
              return item.clone();
          },

          start: function(){
            App.trigger('sortable:start');
          },

          stop: function (e) {
              App.trigger('sortable:end');
              var copied = $(this).data('copied');

              if(!copied){
                e.preventDefault();
                this.copyHelper.remove();
              }
              this.copyHelper = null;
          }
        });
      }

      return this;
    }

  };


});

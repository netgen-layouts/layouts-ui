define(['underscore', 'view', 'app'], function(_, View, App){
  'use strict';

  return {

    connect_with: '[data-zone], [data-section]',
    canceled_attr: 'canceled',

    is_zone: function(){
      return this.sort_element === '[data-zone]';
    },

    set_canceled: function(ui, val){
      $(ui.item).data(this.canceled_attr, val);
    },

    read_canceled: function(ui){
      return $(ui.item).data(this.canceled_attr);
    },

    remove_forbidden_class: function(e){
      $(e.target).closest('[data-type="Section"]').removeClass('forbidden');
    },

    check_sections: function(e, ui){
      var drag_view, receiver_view,
          receiver_element = $(e.target).closest('[data-type="Section"]');

      if(!receiver_element.length){
        this.set_canceled(ui, false);
        return;
      }

      drag_view = $(ui.item).data('_view');
      receiver_view = receiver_element.data('_view');

      console.log('drag_view', drag_view.model.attributes);
      console.log('receiver_view', receiver_view.model.attributes);
      console.log('is_section', drag_view.model.is_section() && receiver_view.model.is_section());

      if(drag_view.model.is_section() && receiver_view.model.is_section()){
        receiver_element.addClass('forbidden');
        this.set_canceled(ui, true);
      }
    },

    receive_is_canceled: function(ui){
      if(this.read_canceled(ui)){
        $(ui.sender).sortable('cancel');
        return true;
      }
      return false;
    },

    zone_accept_blocks: function(ui, block_template, zone_view){
      var zone = zone_view.model;

      if(zone.is_inherited() || !zone.should_accept(block_template)){
        $(ui.sender).sortable('cancel');
        return false;
      }

      return true;
    },

    save_and_add_block: function(ui, block_template, block, receiver_block){
      var section_attributes = {section_id: receiver_block.is_section() && receiver_block.model.id};

      if(block){
        block.set(section_attributes);
      }else{
        block = App.model_helper.init_block(block_template, section_attributes);

        var view_block = App.blocks.create_view(block.template().get('kind'), block);

        if(block.is_group()){
          block.save_group();
        }else{
          block.save();
        }

        ui.item.after(view_block.$el);
        ui.item.remove();
      }
    },

    setup_dnd_for_sections_and_zones: function(){
      var self = this,
          $sort_element = this.is_zone() ? $(this.sort_element) : this.$(this.sort_element);

      $sort_element.sortable({
        connectWith: self.connect_with,
        placeholder: 'no-placeholder',
        handle: '.handle',
        tolerance: 'intersect',
        cursorAt: { left: 5 },
        delay: 150,
        distance: 20,
        over: self.check_sections.bind(self),
        out: self.remove_forbidden_class,
        receive: function(e, ui){
          console.log('base receive', this, arguments);
          if(self.receive_is_canceled(ui)){ return; }

          var drag_block = $(ui.item).data('_view');
          var block_template = drag_block.model;
          var block = block_template.has('template_id') && block_template;
          var receiver_block = $(this).closest('[data-view]').data('_view');

          if(self.is_zone() && !self.zone_accept_blocks(ui, block_template, $(this).data('_view'))){
            return;
          }

          ui.sender.data('copied', true);

          self.save_and_add_block(ui, block_template, block, receiver_block);

        },

        start: function() {
          console.log('start');
          App.trigger('sortable:start');
          $(this).sortable('refreshPositions');
        },

        stop: function(e, ui){
          console.log('stop');
          if(!$(ui.item).read_data_and_remove_key('canceled')){
            App.trigger('block:move');
            App.trigger('positions:update');
          }
          App.trigger('sortable:end');
        }

      });
    },

    setup_dnd_for_blocks: function(){
      if(this.is_zone()){
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
    },

    init: function(){
      this.setup_dnd_for_blocks();
      this.setup_dnd_for_sections_and_zones();
    },

    render: function(){
      this._super('render', arguments);
      this.init();
      return this;
    }

  };

});

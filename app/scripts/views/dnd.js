define(['underscore', 'view', 'app'], function(_, View, App){
  'use strict';

  return {

    connect_with: '[data-zone], [data-container]',
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
      $(e.target).closest('[data-type="Container"]').removeClass('forbidden');
    },

    check_containers: function(e, ui){
      var drag_view, receiver_view,
          receiver_element = $(e.target).closest('[data-type="Container"]');

      if(!receiver_element.length){
        this.set_canceled(ui, false);
        return;
      }

      drag_view = $(ui.item).data('_view');
      receiver_view = receiver_element.data('_view');

      console.log('drag_view', drag_view.model.attributes);
      console.log('receiver_view', receiver_view.model.attributes);
      console.log('as_container', drag_view.model.is_container && drag_view.model.is_container());

      if(drag_view.model.is_container() && receiver_view.model.is_container()){
        receiver_element.addClass('forbidden');
        this.set_canceled(ui, true);
      }

      if(drag_view.model.is_container && drag_view.model.is_container()){
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

    zone_accept_blocks: function(ui, block_type, zone_view){
      var zone = zone_view.model;

      if(zone.is_inherited() || !zone.should_accept(block_type)){
        $(ui.sender).sortable('cancel');
        return false;
      }

      return true;
    },

    save_and_add_block: function(ui, block_or_type, receiver_block){
      var receiver_model = receiver_block.model,
        container_attributes = {
          //container_id: receiver_block.is_container() ? receiver_model.id : null,
          block_type: block_or_type.get('definition_identifier') || block_or_type.get('identifier'),
          zone_identifier: receiver_block.$el.data('zone') || receiver_block.model.get('zone_id'),
          layout_id: App.g.layout.id
        };

      // if we have block
      if(block_or_type.get('definition_identifier')){
        block_or_type.set(container_attributes);
        this.add_block_and_set_position(ui, block_or_type);
      }else{
        block_or_type = App.model_helper.init_block_from_type(block_or_type, container_attributes);
        this.add_block_and_set_position(ui, block_or_type);

        if(block_or_type.is_group()){
          block_or_type.save_group();
        }else{
          block_or_type.save();
        }
      }
    },

    add_block_and_set_position: function(ui, block){
      var position = this.add_new_block(ui, block);
      block.set({ position: position });
    },

    add_new_block: function(ui, block){
      var view_block = App.blocks.create_view(block.type_name(), block),
      position = ui.item.index();
      ui.item.after(view_block.$el);
      if(!$(ui.item).data('type')){
        ui.item.remove();
      }
      return position;
    },

    setup_dnd_for_containers_and_zones: function(){
      console.log(this.sort_element);
      var self = this,
          $sort_element = this.is_zone() ? $(this.sort_element) : this.$(this.sort_element);

      $sort_element.sortable({
        connectWith: self.connect_with,
        placeholder: 'no-placeholder',
        handle: '.handle',
        cursorAt: { left: 5 },
        delay: 150,
        distance: 20,
        over: self.check_containers.bind(self),
        out: self.remove_forbidden_class,
        receive: function(e, ui){
          if(self.receive_is_canceled(ui)){ return; }

          var drag_block = $(ui.item).data('_view');
          var block_or_type = drag_block.model;

          var receiver_block = $(this).closest('[data-view]').data('_view');

          if(self.is_zone() && !self.zone_accept_blocks(ui, block_or_type, $(this).data('_view'))){
            return;
          }

          ui.sender.data('copied', true);

          self.save_and_add_block(ui, block_or_type, receiver_block);

        },

        start: function() {
          console.log('start drag');
          App.trigger('sortable:start');
          $(this).sortable('refreshPositions');
        },

        stop: function(e, ui){
          console.log('stop', this, ui);

          var zone_id = $(ui.item).closest('[data-zone]').data('zone'),
                position = $(ui.item).index(),
                model = $(ui.item).data('_view').model;


          model.move({
            position: position,
            zone_identifier: zone_id
          });

          if($(this).data('zone') !== zone_id){
            $(ui.item).remove();
          }

          App.trigger('sortable:end');
        }

      });
    },

    is_same_container: function(dragables){
      return dragables.receiver.model.id === dragables.sender.model.id;
    },

    setup_dnd_for_blocks: function(){
      if(this.is_zone()){
        $('.blocks .block-items').sortable({
          connectWith: '[data-zone], [data-container]',
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
      this.setup_dnd_for_containers_and_zones();
    },

    render: function(){
      this._super('render', arguments);
      this.init();
      return this;
    }

  };

});

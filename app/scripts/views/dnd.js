define(['underscore', 'view', 'app'], function(_, View, App){
  'use strict';

  return {

    connect_with: '[data-zone], [data-section]',

    is_zone: function(){
      return this.sort_element === '[data-zone]';
    },

    remove_forbidden_class: function(e){
      var receiver_element = $(e.target).closest('[data-type="Section"]');
      receiver_element.removeClass('forbidden');
    },

    check_section: function(e, ui){
      var receiver_element = $(e.target).closest('[data-type="Section"]');
      console.log(e.target);
      console.log(!receiver_element.length);

      if(!receiver_element.length){
        $(ui.item).data('canceled', false);
        return;
      }

      var drag_view = $(ui.item).data('_view'),
          receiver_view = receiver_element.data('_view');

      if(drag_view.model.is_section() && receiver_view.model.is_section()){
        receiver_element.addClass('forbidden');
        $(ui.item).data('canceled', true);
      }

    },

    canceled: function(ui){
      if($(ui.item).data('canceled')){
        $(ui.sender).sortable('cancel');
        return true;
      }
      return false;
    },

    zone_accept_blocks: function(ui, block_template, zone_view){
      if(this.is_zone()){
        var zone = zone_view.model;

        if(zone.is_inherited()){
          $(ui.sender).sortable('cancel');
          return false;
        }
        if(!zone.should_accept(block_template)){
          $(ui.sender).sortable('cancel');
          return false;
        }
      }
      return true;
    },

    save_blocks: function(ui, block_template, block, receiver_block){
      var section_attributes = {section_id: receiver_block.is_section() && receiver_block.model.id};

      if(block){
        block.set(section_attributes);
      }else{
        block = App.model_helper.init_block(block_template, section_attributes);

        console.log(block.attributes);

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


    setup_dnd_for_section_and_zones: function(){

    },

    setup_dnd_for_blocks: function(){

    },

    init: function(){
      this.setup_dnd_for_blocks();
      this.setup_dnd_for_section_and_zones();
    },


    render: function(){
      this._super('render', arguments);
      this.dnd();
      return this;
    },

    dnd: function(){
      console.log('INITIALIZE DND FOR', this.sort_element);
      var self = this,
          $sort_element = this.is_zone() ? $(this.sort_element) : this.$(this.sort_element);

      $sort_element.sortable({
        connectWith: self.connect_with,
        placeholder: 'no-placeholder',
        handle: '.handle',
        //tolerance: 'pointer',
        cursorAt: { left: 5 },
        delay: 150,
        distance: 20,
        over: function(e, ui){
          self.check_section(e, ui);
        },
        out: function(e){
          self.remove_forbidden_class(e);
        },
        receive: function(e, ui){
          console.log('base receive', this, arguments);

          if(self.canceled(ui)){
            return;
          }

          var drag_block = $(ui.item).data('_view');
          var block_template = drag_block.model;
          var block = block_template.has('template_id') && block_template;
          var receiver_block = $(this).closest('[data-view]').data('_view');

          if(!self.zone_accept_blocks(ui, block_template, $(this).data('_view'))){
            return false;
          }

          ui.sender.data('copied', true);

          self.save_blocks(ui, block_template, block, receiver_block);

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

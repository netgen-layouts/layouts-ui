
'use strict';

var Core = require('core_boot');
require('jquery-ui');

module.exports = {

  connect_with: '[data-zone], [data-container], [data-trash]',
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

    // console.log('drag_view', drag_view.model.attributes);
    // console.log('receiver_view', receiver_view.model.attributes);
    // console.log('as_container', drag_view.model.is_container && drag_view.model.is_container());

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
        // block_type: block_or_type.get('definition_identifier') || block_or_type.get('identifier'),
        block_type: block_or_type.get('identifier'),
        zone_identifier: receiver_block.$el.data('zone') || receiver_block.model.get('zone_id'),
        layout_id: parseInt(Core.g.layout.id, 10)
      };

    // if we have block
    if(block_or_type.class_name === 'block'){
      block_or_type.set(container_attributes);
      this.add_block_and_set_position(ui, block_or_type);
    }else{
      block_or_type = Core.model_helper.init_block_from_type(block_or_type, container_attributes);
      block_or_type.fresh = true;
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

    var view_block = Core.blocks.create_view(block.get('definition_identifier'), block),
        position = ui.item.index();
        ui.item.after(view_block.$el);

    // Remove block_definition from UI if we are creating new block
    block.fresh && ui.item.remove() && (block.fresh = false);

    return position;
  },

  setup_dnd_for_containers_and_zones: function(){
    var self = this,
        $sort_element = this.is_zone() ? $(this.sort_element) : this.$(this.sort_element);


    $sort_element.sortable({
      appendTo: document.body,
      // revert: true,
      connectWith: self.connect_with,
      placeholder: 'no-placeholder',
      handle: '.block-header',
      //cursorAt: { left: 5 },
      delay: 150,
      distance: 20,
      over: self.check_containers.bind(self),
      out: self.remove_forbidden_class,
      helper: 'clone',

      receive: function(e, ui){
        if(self.receive_is_canceled(ui)){ return; }

        var drag_block = $(ui.item).data('_view'),
            block_or_type = drag_block.model,
            receiver_block = $(this).closest('[data-view]').data('_view');

        if(self.is_zone() && !self.zone_accept_blocks(ui, block_or_type, $(this).data('_view'))){
          return;
        }

        ui.sender.data('copied', true);

        console.log('DND', receiver_block)
        self.save_and_add_block(ui, block_or_type, receiver_block);

      },

      start: function() {
        Core.trigger('sortable:start');
        self.$unedit($sort_element);
        $(this).sortable('refreshPositions');
      },

      stop: function(e, ui){
        console.log(e, ui);
        var zone_id = $(ui.item).closest('[data-zone]').data('zone'),
            position = $(ui.item).index(),
            model = $(ui.item).data('_view').model;




        var trashed = $(ui.item).data('trashed');
        $(ui.item).data('trashed', null);


        if(!trashed && $(this).data('zone') !== zone_id){
          $(ui.item).remove();

          model.move({
            position: position,
            zone_identifier: zone_id
          });

        }


        $('.right-sidebar').html(JST.sidebar());
        Core.trigger('sortable:end');
      }

    });
  },


  is_same_container: function(dragables){
    return dragables.receiver.model.id === dragables.sender.model.id;
  },


  /**
   * Setup DND for new blocks
   * @method setup_dnd_for_blocks
   */
  setup_dnd_for_blocks: function(){
    var self = this;
    if(this.is_zone()){
      $('.blocks .block-items').sortable({
        connectWith: self.connect_with,
        placeholder: 'no-placeholder',
        appendTo: document.body,

        helper: function (e, item) {
          this.copyHelper = item.clone(true).insertAfter(item);
          $(this).data('copied', false);
          return item.clone();
        },

        start: function(){
          self.$unedit($('.blocks .block-items'));
          Core.trigger('sortable:start');
        },

        stop: function (e) {
          Core.trigger('sortable:end');
          var copied = $(this).data('copied');

          if(!copied){
            e.preventDefault();
            this.copyHelper.remove();
          }
          this.copyHelper = null;

          $('.right-sidebar').html(JST.sidebar());
        }
      });
    }
  },

  setup_trash: function(){
    var $trash_droppable = $('[data-trash]');
    $trash_droppable.sortable({
      receive: function(e, ui){

        $(ui.item).data('trashed', true);

        var drag_block = $(ui.item).data('_view');
        var block_or_type = drag_block.model;
        if(block_or_type.class_name === 'block'){
          drag_block.$destroy()
            .on('cancel', function(){
              $(ui.sender).sortable('cancel');
            });
        }

      }
    });
    return this;
  },

  init: function(){
    this.setup_dnd_for_blocks();
    this.setup_dnd_for_containers_and_zones();
    this.setup_trash();
  },

  render: function(){
    this._super('render', arguments);
    this.init();


    return this;
  },

  $unedit: function(sortableEl){
    Core.trigger('editing:unmark', {block: this});
  }

};

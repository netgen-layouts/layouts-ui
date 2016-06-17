
'use strict';

var Core = require('core_boot');
var Draggable = require('./draggable');
var Receiver = require('./receiver');

require('jquery-ui');

module.exports = {

  connect_with: '[data-zone], [data-container], [data-trash]',
  canceled_attr: 'canceled',

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



  setup_dnd_for_containers_and_zones: function(){
    var self = this,
        $sort_element = this.is_zone() ? $(this.sort_element) : this.$(this.sort_element);

    $sort_element.sortable({
      appendTo: document.body,
      connectWith: self.connect_with,
      placeholder: 'no-placeholder',
      handle: '.block-header',
      delay: 150,
      distance: 20,
      over: self.check_containers.bind(self),
      out: self.remove_forbidden_class,
      helper: 'clone',

      //Only after receiving from other sortable
      receive: function(e, ui){

        if(self.receive_is_canceled(ui)){ return; }

        var draggable = new Draggable(e, ui);
        if(self.is_zone() && !self.zone_accept_blocks(ui, draggable.model, $(this).data('_view'))){
          return;
        }

        draggable.mark_sender_as_copied();
        draggable.is_block_type() && draggable.create_new_block();
      },

      start: function() {
        Core.trigger('sortable:start');
        // $(this).sortable('refreshPositions');
      },


      // After sort and after move to connected sortable
      stop: function(e, ui){
        var draggable = new Draggable(e, ui),
            receiver = new Receiver(this),
            trashed = draggable.read_trashed_and_clear();

        if(!trashed){
          draggable.save_new_position();
          draggable.is_zone_changed_when_moved_to(receiver);
        }

        Core.trigger('sortable:end');
      }

    });


    //Hack for proxing document to sortable element scroll;
    var document_scroll_top = $(document).scrollTop();
    var window_height = $(window).height();
    var sortable_height = $('.main-content').height();
    var ratio = sortable_height/window_height;
    var $scrollable_element = $('.main-content');

    var initial_top = $scrollable_element.scrollTop();
    $(document).off('scroll.dnd').on('scroll.dnd', function(){
      var current_document_scroll_top = $(document).scrollTop();
      var move_by = current_document_scroll_top * ratio;
      current_document_scroll_top > 10 && $scrollable_element.scrollTop(initial_top + move_by);
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
        }
      });
    }
  },

  setup_trash: function(){
    $('[data-trash]').sortable({
      receive: function(e, ui){
        var draggable = new Draggable(e, ui);
        draggable.mark_trashed();

        if(draggable.is_block()){
          draggable.view.$destroy()
            .on('cancel', function(){
              draggable.sender.sortable('cancel');
            });
        }

      }
    });
    return this;
  }

};

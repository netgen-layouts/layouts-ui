'use strict';

var Core = require('netgen-core');
var Draggable = require('./draggable');
var Receiver = require('./receiver');
var $ = Core.$;

//require('../jquery_ui_loader');

/**
 * Copied from jquery.ui.sortable and slightly modified
 */
var orig = $.ui.sortable.prototype._mouseDrag;
$.ui.sortable.prototype._mouseDrag = function(event){


  var i, item, itemElement, intersection,
    o = this.options,
    scrolled = false;

  //Compute the helpers position
  this.position = this._generatePosition(event);
  this.positionAbs = this._convertPositionTo("absolute");

  var scrollParent = o.customScrollParent;

  if (!this.lastPositionAbs) {
    this.lastPositionAbs = this.positionAbs;
  }

  if(scrollParent){
    o.scroll = false;
    var overflowOffset = scrollParent.offset();
    if((overflowOffset.top + scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
      scrollParent[0].scrollTop = scrolled = scrollParent[0].scrollTop + o.scrollSpeed;
    } else if(event.pageY - overflowOffset.top < o.scrollSensitivity) {
      scrollParent[0].scrollTop = scrolled = scrollParent[0].scrollTop - o.scrollSpeed;
    }

    if((overflowOffset.left + scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
      scrollParent[0].scrollLeft = scrolled = scrollParent[0].scrollLeft + o.scrollSpeed;
    } else if(event.pageX - overflowOffset.left < o.scrollSensitivity) {
      scrollParent[0].scrollLeft = scrolled = scrollParent[0].scrollLeft - o.scrollSpeed;
    }

  }



  if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
    $.ui.ddmanager.prepareOffsets(this, event);
  }

  orig.apply(this, arguments);

}


module.exports = {

  connect_with: '[data-zone]:not(".linked_zone") [data-receiver], [data-placeholder], [data-trash]',
  canceled_attr: 'canceled',


  set_canceled: function(ui, val){
    $(ui.item).data(this.canceled_attr, val);
  },

  read_canceled: function(ui){
    return $(ui.item).data(this.canceled_attr);
  },

  remove_forbidden_class: function(e){
    $(e.target).removeClass('forbidden');
  },

  add_forbidden_class: function(e){
    $(e.target).addClass('forbidden');
  },


  check_containers: function(e, ui){
    var drag_view, receiver_view, drag_or_receiver_is_container,
        receiver_element = $(e.target).closest('[data-container]');

    if(!receiver_element.length){
      this.set_canceled(ui, false);
      return;
    }

    drag_view = $(ui.item).data('_view');
    receiver_view = receiver_element.data('_view');
    drag_or_receiver_is_container = receiver_view.model.is_container() && drag_view.model.is_container();

    if(drag_or_receiver_is_container){
      this.add_forbidden_class(e);
      this.set_canceled(ui, true);
    }else{
      this.set_canceled(ui, false);
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
        $sort_element = this.$('[data-receiver]'),
        el_moved = false;

    $sort_element.sortable({
      appendTo: document.body,
      customScrollParent: $('.main-content'),
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
        // console.log(this);
        if(self.receive_is_canceled(ui)){ return; }
        var draggable = new Draggable(e, ui);
        if(self.is_zone && !self.zone_accept_blocks(ui, draggable.model, $(this).closest('[data-zone]').data('_view'))){
          return;
        }

        ui.item.real_target = this;
        draggable.mark_sender_as_copied();
        draggable.is_block_type() && draggable.create_new_block();
      },

      start: function(e, ui) {
        ui.helper.addClass('ngc');
        Core.trigger('sortable:start');

        /*This is needed because of min-height*/
        $(this).sortable('refreshPositions');
      },


      // After sort and after move to connected sortable
      update: function(){
        el_moved = true;
      },
      stop: function(e, ui){
        var real_target = ui.item.real_target || this,
            draggable = new Draggable(e, ui),
            receiver = new Receiver($(real_target).closest('[data-view]')),
            trashed = draggable.read_trashed_and_clear();


        if(!trashed && el_moved){
          if (receiver.is_zone()){
            draggable.save_new_position_for_zone();
          }else{
            draggable.save_new_position_for_container();
          }
          draggable.is_zone_changed_when_moved_to(receiver);
          el_moved = false;
        }

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


      this.$('.block-items').sortable({
        connectWith: self.connect_with,
        placeholder: 'no-placeholder',
        appendTo: document.body,
        over: self.check_containers.bind(self),
        out: self.remove_forbidden_class,

        helper: function (e, item) {
          this.copyHelper = item.clone(true).insertAfter(item);
          $(this).data('copied', false);
          return item.clone();
        },

        start: function(e, ui){
          ui.helper.addClass('ngc');
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

'use strict';

var Core = require('../core');
var $ = Core.$;

function Draggable(e, ui) {
  this.ui = ui;
  this.$drag_item = ui.item;
  this.view = this.$drag_item.data('_view');
  this.model = this.view && this.view.model;
  this.sender = ui.sender;
}

// Draggable.prototype.$receiver = function() {
//   return this.$drag_item.closest('[data-receiver]');
// };

Draggable.prototype.$zone = function() {
  return this.$drag_item.closest('[data-zone]');
};

Draggable.prototype.$zone_wrapper = function() {
  return this.$drag_item.closest('[data-zone-wrapper]');
};

Draggable.prototype.$container = function() {
  return this.$drag_item.closest('[data-container]');
};

Draggable.prototype.container_model = function() {
  return this.$container().data('_view').model;
};

Draggable.prototype.$placeholder = function() {
  return this.$drag_item.closest('[data-placeholder]');
};

Draggable.prototype.placeholder_id = function() {
  return this.$placeholder().data('placeholder');
};

Draggable.prototype.$parent_block = function() {
  return this.$drag_item.parents('[data-block]').data('_view');
};

Draggable.prototype.parent_block_id = function() {
  if(!this.$parent_block()){return null;}
  return this.$parent_block().model.id;
};

Draggable.prototype.zone_id = function() {
  return this.$zone().data('zone');
};

Draggable.prototype.position = function() {
  return this.$drag_item.index();
};

Draggable.prototype.is_trashed = function() {
  return this.$drag_item.data('trashed');
};

Draggable.prototype.mark_trashed = function() {
  return this.$drag_item.data('trashed', true);
};

Draggable.prototype.clear_trashed = function() {
  return this.$drag_item.data('trashed', null);
};

Draggable.prototype.read_trashed_and_clear = function() {
  var trashed = this.is_trashed();
  this.clear_trashed();
  return trashed;
};

Draggable.prototype.mark_sender_as_copied = function() {
  return this.sender.data('copied', true);
};

Draggable.prototype.is_zone_changed_when_moved_to = function(receiver) {
  return this.zone_id() !== receiver.zone_id();
};

Draggable.prototype.remove = function() {
  this.$drag_item.remove();
};

Draggable.prototype.is_block = function() {
  return this.model.class_name === 'block';
};

Draggable.prototype.is_block_type = function() {
  return this.model.class_name === 'block_type';
};


Draggable.prototype.create_new_block = function() {
  var identifier = this.model.get('identifier');
  var attributes = {
    block_type: identifier,
    zone_identifier: this.zone_id(),
    layout_id: Core.g.layout.id,
    parent_position: this.position(),
    parent_placeholder: this.placeholder_id(),
    parent_block_id: this.parent_block_id()
  };



  var new_block = Core.model_helper.init_block_from_type(this.model, attributes);
  var view_block = Core.blocks.create_view(identifier, new_block);
  this.$drag_item.after(view_block.$el);

  if(this.parent_block_id()){
    console.warn('Save in container');
    new_block.save({}, {
      url: new_block.url(attributes.parent_block_id)
    })
    .then(res => {
      const blockModel = Core.g.layout.blocks.models.find(model => model.id === res.id)
      blockModel.trigger('edit');
    })
  }else{
    console.warn('Save')
    new_block.save()
    .then(res => {
      const blockModel = Core.g.layout.blocks.models.find(model => model.id === res.id)
      blockModel.trigger('edit');
    })
  }

  //Remove draggable block_type element
  this.remove();
};



Draggable.prototype.save_new_position_for_zone = function() {
  this.model.set({
    parent_position: this.position(),
    zone_identifier: this.zone_id()
  });

  this.model.move(this.get_new_order_in_zone());
};


Draggable.prototype.get_new_order_in_zone = function() {
  return this.$zone().find('[data-receiver]:first > [data-view]').map(function() {
    return $(this).data('_view').model.id;
  }).get();
};


Draggable.prototype.get_new_order_in_container = function() {
  return this.$container().find('[data-receiver]:first > [data-view]').map(function() {
    return $(this).data('_view').model.id;
  }).get();
};

Draggable.prototype.save_new_position_for_container = function() {
  this.model.set({
    parent_position: this.position(),
    zone_identifier: this.zone_id(),
    parent_placeholder: this.placeholder_id(),
    parent_block_id: this.parent_block_id()
  });
  this.model.move_to_container(this.get_new_order_in_zone(), this.get_new_order_in_container());
};



Draggable.prototype.initialize_zone = function() {
  this.model.set({mapped: true});
  var zone_wrapper = this.$zone_wrapper();

  var zone_wrapper_view = zone_wrapper.data('_view');
  zone_wrapper_view.add_zone(this.model);

  var $zone_el = zone_wrapper_view.render_zone(this.model);
  this.$drag_item.after($zone_el);
  //Remove draggable block_type element
  this.remove();
};

module.exports = Draggable;

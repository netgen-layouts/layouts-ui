'use strict';

function Draggable(e, ui) {
  this.ui = ui;
  this.$drag_item = ui.item;
  this.view = this.$drag_item.data('_view');
  this.model = this.view.model;
  this.sender = ui.sender;
}

Draggable.prototype.$zone = function() {
  return this.$drag_item.closest('[data-zone]');
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
    position: this.position()
  };

  var new_block = Core.model_helper.init_block_from_type(this.model, attributes);
  var view_block = Core.blocks.create_view(identifier, new_block);
  this.$drag_item.after(view_block.$el);
  new_block.save();



  //Remove draggable block_type element
  this.remove();
};



Draggable.prototype.save_new_position = function() {
  this.model.set({
    position: this.position(),
    zone_identifier: this.zone_id()
  })
  this.model.changedAttributes() && this.model.move();
};


module.exports = Draggable;

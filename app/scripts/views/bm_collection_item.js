'use strict';

var Core = require('@netgen/layouts-ui-core');
var $ = Core.$;

module.exports = Core.View.extend({
  template: 'bm_collection_item',

  attributes: function(){
    var className = 'collection-item';
    className += this.model.get('is_dynamic') ? ' dynamic-item' : ' manual-item';
    !this.model.is_visible() && (className += ' hidden-item');
    this.model.get('overflown') && (className += ' overflown-item');
    return {
      class: className,
    };
  },

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.model.collection.bm_collection;
    this.listenTo(this.model, 'delete:success', this.remove);

    return this;
  },

  events: {
    'click .remove-item': '$remove',
    'click .cancel': '$hide_remove_btn',
    'click .set-item-position': '$set_item_position',
    'click .js-cancel-position': '$cancel_item_position',
    'click .js-save-position': '$save_item_position',
    'keydown .item-position-input': '$position_input_keypress',
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);

    return this;
  },

  $move: function(i, via){
    this.model.save({
      position: i
    },{
      via: via || 'move',
      url: this.model.url('move'),
      method: 'POST',
      patch: true
    });
    return this;
  },

  $remove: function(e){
    e && e.preventDefault() && e.stopPropagation();
    var self = this;
    return new Core.Modal({
      title: 'Delete item',
      body: 'Are you sure you want to delete this item? This cannot be undone.',
      apply_text: 'Delete',
    }).on('apply', function(){
      self.model.destroy();
    }).open();
  },

  $set_item_position: function(e){
    e && e.preventDefault();
    this.model.set({
      'editing_position': true,
    });
    this.render();
    this.$('.item-position-input').focus().val('').val(this.model.get('position') + 1);
  },

  $cancel_item_position: function(e){
    e && e.preventDefault();
    this.model.set({
      'editing_position': false,
    });
    this.render();
  },

  $save_item_position: function(e){
    e && e.preventDefault();
    var newPosition = parseInt(this.$('.item-position-input').val()) - 1;
    if (newPosition < 0) {
      return new Core.Snackbar({
        message: 'New position must be larger than 0',
      });
    }
    if (this.bm_collection_model.get('collection_type') === 0 && newPosition >= this.bm_collection_model.items.length) {
      return new Core.Snackbar({
        message: 'New position shouldn\'t be larger than position of the last item in collection (' + (this.bm_collection_model.items.length) + ')',
      });
    }
    if (!isNaN(newPosition)) {
      newPosition !== this.model.get('position') ? this.$move(newPosition) : this.$cancel_item_position();
    }
  },

  $position_input_keypress: function(e){
    if (e.keyCode === 27) { //   cancel on press esc
      this.$cancel_item_position();
    } else if (e.keyCode === 13) {  // save on press enter
      this.$save_item_position();
    } else if ($.inArray(e.keyCode, [46, 8, 9]) !== -1 ||
        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode >= 35 && e.keyCode <= 40)) {
          return;
    } else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  },

});

'use strict';

var Core = require('netgen-core');
var $ = Core.$;
// var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'bm_collection_item',

  attributes: function(){
    var className = 'collection-item';
    this.model.get('type') === 2 && (className += ' dynamic-item');
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
    'click .item-visibility': '$set_visibility',
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

  $set_visibility: function(e){
    e && e.preventDefault();
    var self = this;
    var visibilityModal = new Core.ModalForm({
      url: Core.env.bm_app_url('/collections/item/' + this.model.id + '/config/edit/visibility'),
      via: 'visibility',
      model: this.model
    }).open();
    visibilityModal.toggleSubmit = function(toggleInputs){  // disable submit button if scheduled selected and both date inputs empty
      var visibility = this.serialize().params.edit.visibility;
      toggleInputs && this.$('.visibility-inputs').toggleClass('disabled', visibility.visibility_status !== 'scheduled');
      this.$('.action_apply').prop('disabled', visibility.visibility_status === 'scheduled' && !visibility.visible_from.datetime && !visibility.visible_to.datetime);
    };
    visibilityModal.on('open', function(){
      $('.datetimepicker').each(function(){
        return new Core.DateTimePicker({
          el: $(this),
        }).on('change', function(){
          visibilityModal.toggleSubmit();
        });
      });
      this.$el.on('change', 'input[type="radio"]', function(){
        visibilityModal.toggleSubmit(true);
      });
      this.toggleSubmit(true);
    });
    return visibilityModal;
  },

  $set_item_position: function(e){
    e && e.preventDefault();
    this.model.set({
      'editing_position': true,
    });
    this.render();
    this.$('.item-position-input').focus().val('').val(this.model.get('position'));
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
    this.$move(parseInt(this.$('.item-position-input').val(), 10), 'move_manual');
  },

  $position_input_keypress: function(e){
    if (e.keyCode === 27) { //   cancel on press esc
      this.$cancel_item_position();
    } else if (e.keyCode === 13) {  // save on press enter
      this.$save_item_position();
    }
  },

});

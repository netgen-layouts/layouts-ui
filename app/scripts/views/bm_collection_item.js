'use strict';

var Core = require('netgen-core');
var $ = Core.$;
// var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'bm_collection_item',
  className: 'collection-item',

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
  },

  render: function(){
    Core.View.prototype.render.apply(this, arguments);

    this.model.get('type') === 2 && this.$el.addClass('dynamic-item');
    !this.model.is_visible() && this.$el.addClass('hidden-item');

    return this;
  },

  $move: function(i){
    this.model.save({
      position: i
    },{
      via: 'move',
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
      this.toggleSubmit();
    });
    return visibilityModal;
  },

});

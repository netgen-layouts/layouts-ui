'use strict';

var Core = require('../core');
var $ = Core.$;
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.bm_collection_model = this.collection.bm_collection;

    this.listenTo(this.bm_collection_model.block(), 'refresh:items', this.refresh_items);

    //ITEMS
    this.listenTo(this.collection, 'move:success create:success delete:success move_manual:success ', this.refresh_items_and_block);
    this.listenTo(this.bm_collection_model, 'delete_all:success', this.refresh_items_and_block);
    this.listenTo(this.collection, 'request', this.onRequest);
    this.listenTo(this.collection, 'remove', this.startLoading);
    this.listenTo(this.bm_collection_model, 'read:success', this.endLoading);

    this.on('render', this.setup_dnd);
    this.on('render', this.hide_add_items_if_no_options);

    return this;
  },

  view_items_el: '.bm-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',

  onRequest: function(model, xhr, options){
    if (['move', 'create'].includes(options.via)) this.startLoading();
  },
  startLoading: function(model, xhr, options){
    this.bm_collection_model.set('loading', true);
  },
  endLoading: function(){
    this.bm_collection_model.set('loading', false);
  },

  set_context: function(){
    Core.View.prototype.set_context.apply(this, arguments);

    return this;
  },

  refresh_items_and_block: function(){
    this.refresh_items();
    this.refresh_block();
  },

  refresh_items: function(){
    return this.bm_collection_model.fetch_results();
  },

  refresh_block: function(){
    return this.bm_collection_model.block().fetch();
  },

  hide_add_items_if_no_options: function(){
    var $options = this.$el.closest('.collection-items').find('.value-type-wrapper option');
    !$options.length && this.$('.add-items').hide();
  },

  setup_dnd: function(){
    if (!this.bm_collection_model.get('loading')) {
      this.bm_collection_model.get('collection_type') === 1 ? this.setup_dynamic_dnd() : this.setup_manual_dnd();
    }
  },
  setup_dynamic_dnd: function(){
    var self = this;
    var item_view,
        startPosition;
    var nextTillDynamic = function($el){
      var elView = $el.data('_view');
      if(elView && (elView.model.get('is_dynamic') || elView.model.get('position') === startPosition)){
        $el.addClass('sorting-hidden');
      } else if ($el.next('.collection-item').length) {
        nextTillDynamic($el.next('.collection-item'));
      }
    };
    this.$('.bm-items .manual-item .item-panel:not(.override-item)').draggable({
      delay: 150,
      axis: 'y',
      helper: 'clone',
      handle: '.handle',
      zIndex: 100,
      appendTo: '.bm-items',
      start: function(e, ui){
        item_view = $(this).closest('.collection-item').data('_view');
        startPosition = item_view.model.get('position');
        $(this).closest('.collection-item').addClass('start-item');
      },
      stop: function(){
        self.$('.start-item').removeClass('start-item');
      }
    });
    this.$('.bm-items .collection-item').droppable({
      hoverClass: 'highlight',
      activeClass: 'sorting',
      out: function(){
      },
      over: function(e, ui){
        self.$('.cloned-manual').remove();
        self.$('.sorting-hidden').removeClass('sorting-hidden');
        if ($(e.target).data('_view').model.get('position') !== startPosition && $(this).hasClass('manual-item')){
          var clone = this.cloneNode(true);
          clone.classList.add('cloned-manual');
          if ($(e.target).data('_view').model.get('position') - startPosition === 1) {
            this.insertAdjacentHTML('beforebegin', clone.outerHTML);
            self.$('.start-item').addClass('sorting-hidden');
          } else {
            this.insertAdjacentHTML('afterend', clone.outerHTML);
            nextTillDynamic($(this));
          }
        }
      },
      drop: function(e, ui){
        var newPosition = $(e.target).data('_view').model.get('position');
        if (item_view.model.get('position') !== newPosition) {
          item_view.$move(newPosition);
          $(ui.draggable).remove(); // fix for draggable console error after move
        }
      },
    });
  },
  setup_manual_dnd: function(){
    var self = this;
    this.$('.bm-items').sortable({
      delay: 150,
      axis: 'y',
      helper: 'clone',
      handle: '.handle',
      stop: function(e, ui){
        var newPosition = ui.item.index();
        ui.item.data('_view').model.get('position') !== newPosition && ui.item.data('_view').$move(newPosition + self.bm_collection_model.get('offset'), 'move_manual');
      },
    });
  },

  save_items: function(items){
    this.collection.bm_collection.sync_add_items(items);
  },

});

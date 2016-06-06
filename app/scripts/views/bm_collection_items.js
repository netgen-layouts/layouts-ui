'use strict';

var Core = require('core');
var _ = require('underscore');
var Browser = require('browser');
var BmCollectionItemView = require('./bm_collection_item');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    // this.listenTo(this.collection, 'move:success', this.render);
    this.on('render', this.setup_dnd);
    return this;
  },
  events: {
    'click .add-items': '$addItems'
  },
  view_items_el: '.bm-items',
  ViewItem: BmCollectionItemView,
  template: 'bm_collection_items',
  setup_dnd: function(){
    this.$('.bm-items').sortable({
      handle: '.handle',
      delay: 150,
      cancel: '.item-dynamic',
      appendTo: document.body,
      helper: 'clone',

      stop: function(e, ui){
        $(ui.item).data('_view').$move($(ui.item).index());
      }

    });
  },

  $addItems: function(){

    var browser = new Browser({
      title: 'Content browser',
      tree_config: {
        root_path: 'ezcontent' // ezcontent, ezlocation, eztags
      }
    }).on('apply', function(){
      var items = this.selected_collection.map(function(item){
        return {value_id: item.get('value'), value_type: item.get('type')};
      });
      console.log(items);
    }).load_and_open();



  }
});

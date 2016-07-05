'use strict';

var Core = require('core_boot');
var ZoneView = require('./zone');
var ViewBlocksLoad = require('../views/blocks/load');
var ViewBlockTypes = require('../views/block_types');


module.exports = Core.View.extend({
  extend_with: ['layout_model'],
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.collection, 'reset', this.on_reset);
    this.listenToOnce(this.layout_model.blocks, 'read:success', this.load_blocks);
    return this;
  },


  load_blocks: function(){
    ViewBlocksLoad.load_layout_blocks();
    this.render_block_types_view();
    return this;
  },

  on_reset: function(){
    this.parse_dom()
    return this;
  },

  parse_dom: function(){
    var id, self = this;
    this.$('[data-zone]').each(function(){
      id = $(this).data('zone');
      new ZoneView({
        model: self.collection.get(id),
        el: this
      }).render();
    });
    return this;
  },


  render_block_types_view: function(){
     new ViewBlockTypes({
      el: '.blocks',
      collection: Core.g.block_type_groups
    }).render();
    return this;
  },
});

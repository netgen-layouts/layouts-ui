'use strict';

var Core = require('core');
var $ = Core.$;
var ZoneView = require('./zone');
var ViewBlockTypes = require('./menues/block_types');


module.exports = Core.View.extend({
  extend_with: ['layout_model'],
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.layout_model.blocks, 'blocks_loaded:success', this.parse_dom);
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

    this.render_block_types_view();
    return this;
  },


  render_block_types_view: function(){
    if(!Core.g.block_types.length){return;}
    new ViewBlockTypes({
      collection: Core.g.block_types
    }).render_to('.blocks');

    // new ViewBlockTypes({
    //   collection: Core.g.block_types,
    //   groups: ["content", "ezpublish"]
    // }).render_to('.containers');

    return this;
  },
});

'use strict';

var Core = require('../core');
var $ = Core.$;
var ZoneView = require('./zone');
var Zone = require('../models/zone');
var ViewBlockTypes = require('./menues/block_types');


module.exports = Core.View.extend({
  extend_with: ['layout_model'],
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.layout_model.blocks, 'blocks_loaded:success', this.parse_dom);
    return this;
  },

  parse_dom: function(){
    var id, model, self = this;
    this.$('[data-zone]').each(function(){
      id = $(this).data('zone');
      model = self.collection.get(id) || new Zone();
      model && new ZoneView({
        model: model,
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

    return this;
  },
});

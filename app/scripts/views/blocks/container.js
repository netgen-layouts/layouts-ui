'use strict';

var Core = require('core_boot');
var Block = require('./block');
var Dnd = require('../dnd');

module.exports = Block.extend(Dnd).extend({
  sort_element: '[data-container]',

  initialize: function(){
    this._super('initialize', arguments);
    this.on('block:move block:remove', this.save_positions);
    return this;
  },

  render: function() {
    this._super('render', arguments);
    Core.blocks.load_container_blocks(this);
    this.$('[data-container]').html(this.dom_elements);
    return this;
  },

  save_positions: function(){
    console.log('CONTAINER: save_positions container id: ', this.model.id);
    var positions = [], model;

    this.$('>[data-container]>[data-in-container]').each(function(i, item){
      model = $(item).data('_view').model;

      positions.push({
        block_id: model.id
      });

    });

    this.model.save({positions: positions}, {silent:true});
  }
});

'use strict';

var Core = require('core_boot');
var BlockTypeView = require('./block_type');
var DndView = require('./dnd');

module.exports = Core.View.extend(DndView).extend({
  sort_element: '[data-zone]',
  template: 'block_types/items',

  render: function(){
    this._super('render', arguments);

    this.collection.each(function(group){
      this.render_items(group.types(), '.' + group.id, BlockTypeView);
    }.bind(this));

    return this;
  }

});

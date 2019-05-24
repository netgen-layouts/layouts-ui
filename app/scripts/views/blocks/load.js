'use strict';

var Core = require('../../core');
var ViewBlocks = require('./main');

 module.exports = {

  create_view: function(kind, model){
    var ViewBlockKlass = ViewBlocks[kind] || ViewBlocks.Def;
    return new ViewBlockKlass({
      model: model
    });
  },

  load_group_blocks: function(view_group){
    console.log('load_group_blocks');
    var self = this;

    view_group.$('[data-block]').each(function(n, item){
      var json = $(item).text().trim();
      if(!json){return;}
      var data = JSON.parse(json);

      var block = Core.g.layout.get_block_by_id(data.parent_block_id);

      block.group = view_group.model;
      block.in_group = true;

      var view_block = self.create_view(data.kind, block);

      $(item).html(view_block.$el);
    });
  },

  load_container_blocks: function(container_view){
    container_view.children = [];
    container_view.dom_elements = [];
    Core._.each(container_view.model.get('get_positions'), function(item){
      var block = Core.g.layout.get_block_by_id(item.parent_block_id),
          child = this.create_view(block.type_name(), block);

        block.is_group() && this.load_group_blocks(child);

        container_view.dom_elements.push(child.$el);

    }, this);

  }
};

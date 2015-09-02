define(['underscore', './base', 'app', 'views/dnd'], function(_, Base, App, Dnd){
  'use strict';

  return Base.extend(Dnd).extend({
    form_namespace: 'section',
    sort_element: '[data-section]',
    connect_with: '.blocks, [data-zone]',

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.on('render', this.load_blocks);
      // this.on('render', this.save_positions);
      // App.on('block:render', , this);
      // App.on('block:destroy', this.save_positions, this);
      // App.on('block:move', this.save_positions, this);
      return this;
    },

    load_blocks: function(){
      App.blocks.load_section_blocks(this);
    },

    render: function() {
      Base.prototype.render.apply(this, arguments);
      this.dnd();
      return this;
    },

    save_positions: function(){
      console.warn('[SECTION] Saving positions');
      var positions = [];
      this.$('[data-type]').each(function(i, item){
        var model = $(item).data('_view').model;
        positions.push({
          block_id: model.id,
          block_type_id: model.get('template_id')
        });
      });

      this.model.save({
        positions: positions
      }, {silent:true});
    }
  });
});

define(['underscore', './base', 'app', 'views/dnd'], function(_, Base, App, Dnd){
  'use strict';

  return Base.extend(Dnd).extend({
    form_namespace: 'section',
    sort_element: '[data-section]',
    connect_with: '[data-section], [data-zone]',

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'read:success', this.setup_children_events);
      App.on('block:move', this.save_positions, this);
      return this;
    },

    render: function() {
      Base.prototype.render.apply(this, arguments);
      App.blocks.load_section_blocks(this);
      this.$('[data-section]').html(this.dom_elements);
      this.dnd();
      return this;
    },


    setup_children_events: function(){
      console.log('setup_children_events');
      _.each(this.children, function(child){
        console.log(child);
        this.listenTo(child, 'destroy', this.save_positions);
      }, this);
      return this;
    },

    save_positions: function(){
      console.warn('[SECTION] Saving positions');
      var positions = [];
      this.$('[data-in-section]').each(function(i, item){
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

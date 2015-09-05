define(['underscore', './base', 'app', 'views/dnd'], function(_, Base, App, Dnd){
  'use strict';

  return Base.extend(Dnd).extend({
    form_namespace: 'section',
    sort_element: '[data-section]',

    initialize: function(){
      this._super('initialize', arguments);
      this.on('block:move block:remove', this.save_positions);
      return this;
    },

    render: function() {
      this._super('render', arguments);
      App.blocks.load_section_blocks(this);
      this.$('[data-section]').html(this.dom_elements);
      return this;
    },

    save_positions: function(){
      console.log('SECTION: save_positions section id: ', this.model.id);
      var positions = [], model;

      this.$('>[data-section]>[data-in-section]').each(function(i, item){
        model = $(item).data('_view').model;

        positions.push({
          block_id: model.id,
          block_type_id: model.get('template_id')
        });

      });

      this.model.save({positions: positions}, {silent:true});
    }
  });
});

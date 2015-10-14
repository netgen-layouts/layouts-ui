define(['underscore', './base', 'app', 'views/dnd'], function(_, Base, App, Dnd){
  'use strict';

  return Base.extend(Dnd).extend({
    sort_element: '[data-container]',

    initialize: function(){
      this._super('initialize', arguments);
      this.on('block:move block:remove', this.save_positions);
      return this;
    },

    render: function() {
      this._super('render', arguments);
      App.blocks.load_container_blocks(this);
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

      var container = _.extend({}, this.model.attributes, { positions: JSON.stringify(positions) });

      console.log(container);

      this.model.save({container}, {silent:true});
    }
  });
});

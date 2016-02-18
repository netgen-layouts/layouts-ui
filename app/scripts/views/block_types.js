define(['underscore', 'view', './block_type', 'app', './dnd'], function(_, View, ViewBlockType, App, Dnd) {
  'use strict';

  return View.extend(Dnd).extend({
    sort_element: '[data-zone]',
    template: 'block_types/items',

    render: function(){
      this._super('render', arguments);

      this.collection.each(function(group){
        this.render_items(group.types(), '.' + group.id, ViewBlockType);
      }.bind(this));

      return this;
    }

  });

});

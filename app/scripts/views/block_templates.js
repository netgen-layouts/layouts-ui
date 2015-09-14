define(['underscore', 'view', './block_template', 'app', './dnd'], function(_, View, ViewBlockTemplate, App, Dnd) {
  'use strict';

  return View.extend(Dnd).extend({
    sort_element: '[data-zone]',
    template: 'block_templates/items',

    render: function(){
      this._super('render', arguments);

      _.each(this.collection.by_group(), function(items, group_name){
        this.render_items(items, '.'+group_name+'-blocks', ViewBlockTemplate);
      }, this);

      return this;
    }

  });

});

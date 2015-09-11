define(['underscore', 'view', './block_template', 'app', './dnd'], function(_, View, ViewBlockTemplate, App, Dnd) {
  'use strict';

  return View.extend(Dnd).extend({
    sort_element: '[data-zone]',
    template: 'block_templates/items',
    //ViewItem: ViewBlockTemplate,

    initialize: function(){
      this._super('initialize', arguments);

      var block_types = this.collection.by_group();

      this.context.simple_blocks = block_types[0];
      this.context.group_blocks = block_types[1];
      this.context.container_blocks = block_types[2];
      this.context.custom_blocks = block_types[3];

      return this;
    }
  });

});

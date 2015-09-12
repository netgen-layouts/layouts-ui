define(['underscore', 'view', './block_template', 'app', './dnd'], function(_, View, ViewBlockTemplate, App, Dnd) {
  'use strict';

  return View.extend(Dnd).extend({
    sort_element: '[data-zone]',
    template: 'block_templates/items',

    initialize: function(){
      this._super('initialize', arguments);

      var block_types = this.collection.by_group();

      this.simple_blocks = block_types[0];
      this.group_blocks = block_types[1];
      this.container_blocks = block_types[2];
      this.custom_blocks = block_types[3];

      return this;
    },

    render: function(){
      this._super('render', arguments);

      this.render_group(this.simple_blocks, '#simple-blocks');
      this.render_group(this.group_blocks, '#group-blocks');
      this.render_group(this.container_blocks, '#container-blocks');
      this.render_group(this.custom_blocks, '#custom-blocks');

      return this;
    },

    render_group: function(group, html_id){
      var view;
      _.each(group, function(model){
        view = new ViewBlockTemplate({
          model: model
        });
        this.$(html_id).append(view.render().$el);
      }, this);
    }
  });

});

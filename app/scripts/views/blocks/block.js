'use strict';

var Core = require('core_boot');

module.exports = Core.View.extend({

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.setup_dom_element);
    this.on('render', this.update_positions);
    this.listenTo(this.model, 'delete:success', this.on_destroy);
    if(!this.model.isNew()){
      this.setup_dom_element();
      this.render();
    }
  },

  events: {
    'click > .block_actions .action-edit': '$edit',
    //'dblclick > .block_actions .action-destroy': '$fast_destroy'
     'click > .block_actions .action-destroy': '$destroy'
  },

  setup_dom_element: function(){
    this.model.is_in_container() && this.$el.attr('data-in-container', '');
    this.$el
      .attr('data-block', '')
      .attr('data-type', this.model.type_name());
    return this;
  },

  /**
   * NOTE: when overriding the render DO NOT forget to trigger events
   *       if not calling super method
   * @param  {html}
   * @return {this}
   */
  render: function(html){
    Core.View.prototype.render.apply(this, arguments);
    this.$el.html(html || this.model.get('html'));
    return this.append_additionals();
  },

  append_additionals: function(){
    this.$el
      .prepend(JST.block_actions(this.context))
      .prepend(JST.block_template(this.context));
    return this;
  },

  $container_el: function(){
    return this.$el.parents('[data-type="Container"]');
  },

  is_in_container: function(){
    return this.$container_el().length;
  },

  container: function(){
    return this.is_in_container() && this.$container_el().data('_view');
  },

  is_container: function(){
    return this.model.is_container();
  },

  $edit: function(){

    new Core.FormModal({
      model: this.model
    });

    this.model.fetch({via: 'edit/full'});

    return this;
  },

  $destroy: function(){
    var self = this;
    new Core.Modal({
      title: 'Confirm',
      body: 'Are you sure you want to delete?'
    }).on('apply', function(){
      console.log('View destroy model', self.model);
      self.model.destroy();
    }).open();
  },

  on_destroy: function(){
    var is_in_container = this.is_in_container(),
        container = this.container();

    this.remove();
    is_in_container && container.trigger('block:remove');
    Core.trigger('positions:update');
  },

  $fast_destroy: function(){
    this.remove();
    this.model.destroy();
    Core.trigger('positions:update');
  }

});

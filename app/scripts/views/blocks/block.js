'use strict';

var Core = require('core_boot');
var SideBarView = require('../sidebar');

module.exports = Core.View.extend({

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.setup_dom_element);
    // this.on('render', this.update_positions);


    this.listenTo(this.model, 'delete:success', this.on_destroy);
    this.listenTo(Core, 'editing:unmark', this.editing_unmark);
    if(!this.model.isNew()){
      this.setup_dom_element();
      this.render();
    }
  },

  events: {
    'click': '$edit',
    //'dblclick > .block_actions .action-destroy': '$fast_destroy'
     'click .action-destroy': '$destroy'
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
    if(this.editing){return;}
    this.editing_mark();

    this.edit_view = new SideBarView({
      model: this.model
    });

    $.get(this.model.url('edit')).done(function(response){
        this.edit_view.$el.html(response.html);
        $('.right-sidebar').html(this.edit_view.render().$el);
        Core.trigger('editing:unmark', {block: this});
      }.bind(this));


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
  },

  editing_mark: function(){
    this.editing = true;
    this.$el.addClass('editing');
  },


  editing_unmark: function(data){
    if(this === data.block){return;}
    this.editing = false;
    this.edit_view && this.edit_view.remove();
    this.$el.removeClass('editing');
  }

});

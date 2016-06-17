'use strict';

var Core = require('core_boot');
var SideBarView = require('../sidebar');
var _ = require('underscore');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change', this.setup_dom_element);

    this.listenTo(this.model, 'create:success read:success', this.render);
    this.listenTo(this.model, 'create:success', this.$edit);
    this.listenTo(this.model, 'delete:success', this.on_destroy);
    this.listenTo(Core, 'editing:unmark', this.editing_unmark);
    this.listenTo(this.model, 'change_type:success', this.refresh_sidebar);
    this.listenTo(this.model, 'edit', this.$edit);
    this.listenTo(this.model, 'change_type:success sidebar_save:success', this.reload_model);
    if(!this.model.isNew()){
      this.setup_dom_element();
      this.render();
    }
  },

  reload_model: function(){
    this.model.fetch();
    return this;
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
      .attr('data-type', this.model.get('identifier'));
    return this;
  },

  /**
   * NOTE: when overriding the render DO NOT forget to trigger events
   *       if not calling super method
   * @param  {html}
   * @return {this}
   */
  render: function(x){
    _.isString(x) && console.error(x);
    Core.View.prototype.render.apply(this, arguments);
    // this.$el.html(html || this.model.get('html'));
    this.$el.html(this.model.get('html'));
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

  refresh_sidebar: function(){
    this.edit_view && this.edit_view.load();
    return this;
  },

  load_sidebar: function(){
    this.edit_view = new SideBarView({
      model: this.model
    }).load();

    $('.right-sidebar').html(this.edit_view.$el);

  },

  $edit: function(){
    if(this.editing){return;}
    Core.trigger('editing:unmark', {block: this});
    this.editing_mark();
    this.load_sidebar();
    return this;
  },

  $destroy: function(){
    var self = this;
    return new Core.Modal({
      title: 'Confirm',
      body: 'Are you sure you want to delete?'
    }).on('apply', function(){
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

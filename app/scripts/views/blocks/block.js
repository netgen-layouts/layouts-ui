'use strict';

var Core = require('core_boot');
var SideBarView = require('../sidebar');
var _ = require('underscore');

module.exports = Core.View.extend({
  prevent_auto_render: true,

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);

    this.listenTo(Core,       'editing:unmark', this.editing_unmark);

    this.listenTo(this.model, 'change', this.setup_dom_element);
    this.listenTo(this.model, 'change:html', this.render);
    this.listenTo(this.model, 'create:success', this.$edit);
    this.listenTo(this.model, 'delete:success', this.on_destroy);
    this.listenTo(this.model, 'change_type:success', this.refresh_sidebar);
    this.listenTo(this.model, 'edit', this.$edit);
    this.listenTo(this.model, 'change_type:success sidebar_save:success', this.reload_model);
    this.listenTo(this.model, 'restore:success', this.after_restore);
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
    'click .js-destroy': '$destroy',
    'click .js-revert': '$restore_block'
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
    this.$el.html(this.model.get('html'));
    if (!this.model.get('has_published_state')){
      this.$el.find('.js-revert').hide();
    }
    Core.View.prototype.render.apply(this, arguments);
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
    })

    $('.right-sidebar').html(this.edit_view.$el);

    this.edit_view.load()

  },

  $edit: function(){
    if(this.editing){return;}
    // $('#sidebar').addClass('loading');
    Core.trigger('editing:unmark', {block: this});
    this.editing_mark();
    this.load_sidebar();
    return this;
  },

  $destroy: function(e){
    e.stopPropagation();
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
    if(data && this === data.block){return;}
    this.editing = false;
    this.$el.removeClass('editing');
  },

  $restore_block: function(e){
    e.stopPropagation();
    var self = this;
    return new Core.Modal({
      title: 'Confirm',
      body: "Are you sure you want to revert the block to its published version? All of the changes you have made will be lost."
    }).on('apply', function(){
      self.model.restore();
    }).open();
  },

  after_restore: function(){
    this.reload_model();
    this.refresh_sidebar();
  }

});

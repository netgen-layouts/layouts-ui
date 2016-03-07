define(['view', 'collections/locations', './list', './pagination'], function(View, Locations, ListView, PaginationView){
  'use strict';

  return View.extend({
    template: 'browser/tree_item',
    tagName: 'li',
    className: 'item',

    events:{
      'click': 'toggle_tree',
      'click a': 'open_tree'
    },

    limit: 3,
    current_page: 1,

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom();
      return this;
    },

    setup_dom: function(){
      if(this.model.has_children()){
        this.$el.addClass('has_children');
      }

      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-type', this.model.type());
    },

    is_open: function(){
      return this.$el.hasClass('open');
    },

    toggle_tree: function(e){
      e.stopPropagation();

      if(!this.is_open()){
        this.open_tree(e);
      }else{
        this.$el.toggleClass('open');
      }
    },

    select_tree_item: function(){
      $('.tree .selected').removeClass('selected');
      this.$el.addClass('selected');
    },

    open_tree: function(e){
      e.stopPropagation();

      this.select_tree_item();

      this.show_preview();

      this.create_list_view();

      var locations = new Locations();
      this.$el.addClass('loading');
      locations.fetch_tree_model_id(this.model.id, {
        success: function(){
          this.render_tree(locations);
          this.show_breadcrumb(locations);
        }.bind(this)
      });
    },

    render_tree: function(collection){
      this.$el.removeClass('loading');
      this.$el.addClass('open');
      this.model.loaded = true;
      this.open = true;
      this.parent.browser.render_subtree(this.$('> ul'), collection);
    },

    create_list_view: function(){
      this.parent.browser.render_list_view(this.model);
    },

    show_preview: function(){
      this.parent.browser.render_preview(this.model);
    },

    show_breadcrumb: function(collection){
      this.parent.browser.render_breadcrumb(collection);
    }


  });

});

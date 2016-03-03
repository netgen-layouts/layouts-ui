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

      if(this.model.is_root()){
        this.$el.addClass('root');
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

      this.create_list_view();

      this.collection = new Locations();
      this.$el.addClass('loading');
      this.listenTo(this.collection, 'sync', this.render_tree);
      this.collection.fetch_tree_model_id(this.model.id);
    },

    render_tree: function(){
      this.$el.removeClass('loading');
      this.$el.addClass('open');
      this.model.loaded = true;
      this.open = true;
      this.parent.browser.render_subtree(this.$('> ul'), this.collection);
    },

    create_list_view: function(){
      var locations = new Locations();
      locations.browser = this.parent.browser;

      new ListView({
        collection: locations,
        el: '.right-panel .list',
        browser: this.parent.browser
      });

      locations.fetch_list_model_id(this.model.id);

    },

  });

});

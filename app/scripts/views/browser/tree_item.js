define(['view', './list', 'collections/node_list', './pagination'], function(View, ListView, NodeList, PaginationView){
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
      this.$el.attr('data-type', this.model.get('kind'));
    },

    is_open: function(){
      return this.$el.hasClass('open');
    },

    add_selected_class: function(){
      $('.item').removeClass('selected');
      this.$el.addClass('selected open');
    },

    remove_selected_class: function(){
      if(this.$el.find('.open')){ return; }
      this.$el.removeClass('selected open');
    },

    toggle_tree: function(e){
      e.stopPropagation();
      this.$el.toggleClass('open');
      // if(!this.is_open()){
      //   this.open_tree();
      // }
    },

    open_tree: function(e){
      //e.stopPropagation();

      this.add_selected_class();

      this.create_list();

      if(!this.model.has_children()){ return; }

      if(this.open){
        this.open = false;
        this.remove_selected_class();
        return;
      }

      if(this.model.loaded){
        this.open = true;
        this.add_selected_class();
        return;
      }

      this.$el.addClass('loading');

      this.model.fetch({
        silent: true,
        data: { tree: true },
        success: function(){
          this.render_tree();
        }.bind(this)
      });

    },

    render_tree: function(){
      this.$el.removeClass('loading');
      this.$el.addClass('open');
      this.model.loaded = true;
      this.open = true;
      this.parent.browser.render_subtree(this.$('> ul'), this.model.children());
    },

    create_list: function(){
      var nodes = new NodeList();
      nodes.browser = this.parent.browser;

      new ListView({
        collection: nodes,
        el: '.right-panel .list',
        browser: this.parent.browser
      });

      nodes.fetch({
        data: { parent_id: this.model.id, limit: this.limit }
      });

    },

  });

});

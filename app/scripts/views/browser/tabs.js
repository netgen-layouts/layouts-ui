define([
  'underscore',
  'app',
  'view',
  'views/modal',
  'collections/items',
  './root_items',
  './tree',
  './list_root',
  './list',
  './preview',
  './breadcrumb',
  './breadcrumb_search_item'],
  function(_, App, View, Modal, Items, RootItemsView, TreeView, ListRootView, ListView, PreviewView, BreadcrumbView, BreadcrumbSearchItemView){

  'use strict';

  return Modal.extend({

    extend_with: ['browser', 'columns'],

    template: 'browser/tabs',

    prevent_auto_render: true,

    events:{
      'click .btn-preview': '$toggle_preview',
      'submit form': '$search'
    },

    initialize: function(){
      Modal.prototype.initialize.apply(this, arguments);

      this.root_items = App.g.tree_config.root_items;

      this.listenToOnce(this.collection, 'sync', this.render_root_item_views.bind(this));

      this.listenTo(this.collection, 'sync', this.render_browse_tab.bind(this));

      App.on('item:check_changed', this.toggle_selected_list_item.bind(this));

      return this;
    },

    render: function(){
      Modal.prototype.render.apply(this, arguments);
      this.$('#browser-tabs').tabs();
      this.set_preview_height();
      return this;
    },

    toggle_selected_list_item: function(model){
      var tr = 'tr[data-id="' + model.id + '"]';
      if(model.is_checked()){
        this.list_view.$(tr) && this.list_view.$(tr).data('_view').check_item();
        this.search_list_view && this.search_list_view.$(tr).length &&
          this.search_list_view.$(tr).data('_view').check_item();
      }else{
        this.list_view.$(tr) && this.list_view.$(tr).data('_view').uncheck_item();
        this.search_list_view && this.search_list_view.$(tr) &&
          this.search_list_view.$(tr).data('_view').uncheck_item();
      }
    },

    render_root_item_views: function(){
      this.render_root_items();
      this.render_search_root_items();
    },

    render_browse_tab: function(){
      var model = this.root_items.selected_model();
      this.render_tree();
      this.render_list_view(model);
      this.render_breadcrumb(model);
    },

    render_root_items: function(){
      this.root_items_view = new RootItemsView({
        collection: this.root_items,
        tabs: this,
        'el': '.root-items'
      }).render();

      return this;
    },

    render_tree: function(){
      this.tree_view = new TreeView({
        collection: this.collection,
        tabs: this,
        el: '.tree'
      }).render();

      return this;
    },

    render_subtree: function(el, items){
      var collection = items;

      this.tree_view = new TreeView({
        collection: collection,
        tabs: this,
        el: el || '.tree'
      }).render();

      return this;
    },

    render_list_root: function(model){
      model.browser = this.browser;

      this.list_root_view = new ListRootView({
        model: model,
        el: '.list .list-root',
        tabs: this
      }).render();

    },

    render_list_view: function(model){
      var items = new Items();
      items.browser = this.browser;

      this.list_view = new ListView({
        collection: items,
        el: '.right-panel .list',
        browser: this.browser,
        tabs: this
      });

      this.list_view.on('render', function(){
        this.render_list_root(this.root_model || model);
        this.root_model = null;
      }.bind(this));

      items.fetch_list_model_id(model.id);
    },

    render_breadcrumb: function(collection){
      this.breadcrumb = new BreadcrumbView({
        collection: collection.path,
        'el': '.breadcrumb-list',
        tabs: this
      }).render();
    },

    render_preview: function(model){
      this.preview = new PreviewView({
        context: {
          html: model.get('html') || '<h3>' + model.get('name') + '</h3>'
        },
        'el': '.preview'
      }).render();
    },

    set_preview_height: function(){
      var $panel = this.$('.preview-panel .panel');
      $panel.height($panel.closest('.modal-body').height() - 22); // padding and border of .preview-panel .panel
    },

    $toggle_preview: function(){
      this.$('.preview-panel').toggle();
      this.$('.list-panel')
        .toggleClass('col-md-7')
        .toggleClass('col-md-9');
    },

    /* Search */
    $search: function(e){
      e.preventDefault();

      this.render_search_tab();

      return false;
    },

    render_search_tab: function(model){
      var items = new Items();
      items.browser = this.browser;
      // if user click on breadcrumb link we have a model
      if(model){
        items.fetch_list_model_id(model.id, {
          success: function(){
            this._render_search_list_view(items);
            this.render_search_breadcrumb(items);
          }.bind(this)
        });
      }else{
        items.search_data({
          data: this.serialize('form').params,
          success: function(){
            this._render_search_list_view(items);
            console.log(model && model.get('name'));
            this.render_search_breadcrumb(items);
          }.bind(this)
        });
      }

    },

    _render_search_list_view: function(items){
      this.search_list_view = new ListView({
        collection: items,
        el: '.right-panel .search-list',
        browser: this.browser,
        tabs: this,
        name: 'search'
      });
    },

    render_search_root_items: function(){
      this.root_items_view = new RootItemsView({
        collection: this.root_items,
        tabs: this,
        'el': '.search-root-items'
      }).render();

      return this;
    },

    render_search_breadcrumb: function(collection){
      this.change_breadcrumb_home(collection.path.first());

      this.breadcrumb = new BreadcrumbView({
        collection: collection.path,
        'el': '.breadcrumb-search',
        tabs: this,
        ViewItem: BreadcrumbSearchItemView
      }).render();
    },

    change_breadcrumb_home: function(model){
      model && model.set({ name: 'Search for "' + this.$('#search_text').val() + '"'});
    },

    disable_search_panel: function(){
      this.$('.search-left-panel').find('*').prop('disabled', true);
    },

    enable_search_panel: function(){
      this.$('.search-left-panel').find('*').prop('disabled', false);
    }

  });

});

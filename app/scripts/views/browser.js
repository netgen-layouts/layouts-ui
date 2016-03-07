define([
  'underscore', 'app', 'view',
  './modal',
  './browser/header',
  './browser/tree',
  'collections/menu_items',
  './browser/list',
  'collections/locations',
  './browser/preview',
  './browser/breadcrumb'],
  function(_, App, View, Modal, HeaderView, TreeView, MenuItems, ListView, Locations, PreviewView, BreadcrumbView){

  'use strict';

  return Modal.extend({

    template: 'browser',

    className: 'browser modal fade',

    prevent_auto_render: true,

    events:{
      'click': 'browser_click'
    },

    initialize: function(options){
      Modal.prototype.initialize.apply(this, arguments);

      this.menu_items = new MenuItems();
      this.menu_items.save_default_columns();
      this.menu_items.fetch();

      this.root_locations = options.root_locations;
      this.selected_collection = new Locations();

      this.on('open', this.render_header);
      this.listenTo(this.collection, 'sync', function(){
        this.render_tree();
        var model = this.root_locations.selected_model();
        this.render_list_view(model);
        this.render_breadcrumb(model);
        console.log(model.path);
      });

      return this;
    },

    is_root: function(id){
      return this.root_locations.some(function(item){ return item.id === id; });
    },

    render_header: function(){
      this.header_view = new HeaderView({
        collection: this.root_locations,
        browser: this,
        'el': '.header'
      }).render();

      return this;
    },

    render_tree: function(){
      this.tree_view = new TreeView({
        collection: this.collection,
        browser: this,
        el: '.tree'
      }).render();

      return this;
    },

    render_subtree: function(el, items){
      var collection = items;

      this.tree_view = new TreeView({
        collection: collection,
        browser: this,
        el: el || '.tree'
      }).render();

      return this;
    },

    render_list_view: function(model){
      var locations = new Locations();
      locations.browser = this;

      this.list_view = new ListView({
        collection: locations,
        el: '.right-panel .list',
        browser: this
      });

      locations.fetch_list_model_id(model.id);
    },

    render_preview: function(model){
      this.preview = new PreviewView({
        context: {
          html: model.get('html') || '<h3>' + model.get('name') + '</h3>'
        },
        'el': '.preview-panel .preview'
      }).render();
    },

    render_breadcrumb: function(collection){
      this.breadcrumb = new BreadcrumbView({
        collection: collection.path,
        'el': '.modal-subheader .breadcrumb',
        browser: this
      }).render();
    },

    selected_ids: function(){
      return this.selected_collection.pluck('id');
    },

    browser_click: function(e){
      App.trigger('browser:click');
    }

  });

});

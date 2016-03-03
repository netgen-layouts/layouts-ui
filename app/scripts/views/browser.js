define([
  'underscore', 'app', 'view',
  './modal',
  './browser/header',
  './browser/tree',
  'collections/menu_items',
  './browser/list',
  'collections/locations'], function(_, App, View, Modal, HeaderView, TreeView, MenuItems, ListView, Locations){

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
      this.selected_collection = this.collection.new_from();

      this.on('open', this.render_header);
      this.listenTo(this.collection, 'sync', this.render_tree);
      this.listenTo(this.collection, 'sync', this.render_list_view);

      return this;
    },

    select_first_root_locations: function(){
      this.$('.header-item').first().addClass('selected');
    },

    render_header: function(){
      this.header_view = new HeaderView({
        collection: this.root_locations,
        browser: this,
        'el': '.header'
      }).render();

      this.select_first_root_locations();
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

      console.log('render subtree');

      return this;
    },

    render_list_view: function(){
      var locations = new Locations();
      locations.browser = this;

      this.list_view = new ListView({
        collection: locations,
        el: '.right-panel .list',
        browser: this
      });

      var model = this.root_locations.selected_model();
      locations.fetch_list_model_id(model.id);
    },

    selected_ids: function(){
      return this.selected_collection.pluck('id');
    },

    browser_click: function(e){
      App.trigger('browser:click');
    }

  });

});

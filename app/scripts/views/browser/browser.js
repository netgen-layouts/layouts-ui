define([
  'underscore',
  'app',
  'view',
  'views/modal',
  'collections/items',
  'collections/columns',
  './browse',
  './selected_items'
  ], function(_, App, View, Modal, Items, Columns, BrowseView, SelectedItems){

  'use strict';

  return Modal.extend({

    template: 'browser/browser',

    className: 'browser modal fade',

    prevent_auto_render: true,

    events:{
      'click': '$browser_click',
      'click .btn-preview': '$toggle_preview'
    },

    initialize: function(options){
      Modal.prototype.initialize.apply(this, arguments);

      this.tree_collection = options.tree_collection;
      this.selected_collection = new Items();

      this.listenTo(this.selected_collection, 'add remove', this.render_selected_items.bind(this));

      this.on('open', function(){
        this.render_browse_view();
      }.bind(this));

      return this;
    },

    render_browse_view: function(){
      var columns = new Columns();

      this.browse = new BrowseView({
        collection: this.tree_collection,
        el: '.browser-tabs',
        browser: this,
        columns: columns
      });

      columns.fetch({
        success: function(){
          this.browse.render();
        }.bind(this)
      });
    },

    render_selected_items: function(){
      this.selected_items = new SelectedItems({
        collection: this.selected_collection,
        el: '.selected-items',
        browser: this,
      }).render();
    },

    selected_values: function(){
      return this.selected_collection.pluck('value');
    },

    $browser_click: function(){
      App.trigger('browser:click');
    }

  });

});

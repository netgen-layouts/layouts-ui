define([
  'underscore', 'app', 'view', 'views/modal', 'collections/items', 'collections/columns', './browse'], function(_, App, View, Modal, Items, Columns, BrowseView){

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

      this.on('open', function(){
        this.render_browse_view();
      }.bind(this));

      return this;
    },

    render_browse_view: function(){
      var columns = new Columns();

      this.browse = new BrowseView({
        collection: this.tree_collection,
        el: '.browse',
        browser: this,
        columns: columns
      });

      this.listenTo(columns, 'sync', function(){
        console.log('SYYYYYYYYYYYNC', columns);
        this.browse.render();
      }.bind(this));

      columns.fetch();
    },

    selected_values: function(){
      return this.selected_collection.pluck('value');
    },

    $browser_click: function(){
      App.trigger('browser:click');
    }

  });

});

define(['underscore', 'view', './modal', './browser/folder'], function(_, View, Modal, FolderView){
  'use strict';

  return Modal.extend({

    template: 'browser',

    className: 'browser modal fade',

    prevent_auto_render: true,

    initialize: function(){
      Modal.prototype.initialize.apply(this, arguments);
      this.on('open', this.render_panels);
      return this;
    },

    render_panels: function(){

      var folder_view = new FolderView({
        collection: this.collection,
        browser: this
      });

      folder_view.setElement('.left-panel').render();

      return this;
    },

    select_item: function(model, view){
      _.each(this.collection.get(model.id).children(), function(item){
        view.render_folder(item, view);
      }, this);
    },


  });

});

define(['underscore', 'view', './folder_item'], function(_, View, FolderItem){
  'use strict';

  return View.extend({
    template: 'browser/folder',
    tagName: 'ul',
    prevent_auto_render: true,

    initialize: function(opts){
      View.prototype.initialize.apply(this, arguments);
      this.browser = opts.browser;
      return this;
    },

    render: function(){
      View.prototype.render.apply(this, arguments);

      _.each(this.collection.roots(), this.render_folder, this);
      return this;
    },

    render_folder: function(model, view){
      var folder_item = new FolderItem({
        model: model,
        folder: this,
        browser: this.browser
      });

      console.log(this.browser);

      if(view){
        view.$el.append(folder_item.render().el);
      }else{
        this.$('.folder').append(folder_item.render().el);
      }

    }

  });

});

define(['app', 'model', './mixin/tree'], function(App, Model, MixinTree){
  'use strict';

  return Model
    .extend(MixinTree)
    .extend({

      content_browser: true,

      path: function(){
        return App.g.tree_config.name() + '/items';
      },

      has_children: function(){
        return this.attributes.has_children;
      },

      can_show_children: function(){
        return this.attributes.has_children && !this.is_root_model;
      },

      type: function(){
        return this.attributes.type;
      },

      select: function(){
        this.selected = true;
      },

      deselect: function(){
        this.selected = false;
      },

      check: function(){
        this.selected_collection().add(this);
        return this;
      },

      uncheck: function(){
        this.selected_collection().remove(this);
        return this;
      },

      is_checked: function(){
        return this.selected_collection().get(this.id);
      },

      selected_collection: function(){
        return (this.collection && this.collection.browser && this.collection.browser.selected_collection) ||
          (this.browser && this.browser.selected_collection);
      }

    });

});

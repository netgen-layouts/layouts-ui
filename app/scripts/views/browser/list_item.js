define(['./list_base', 'collections/items'], function(ListBase, Items){
  'use strict';

  return ListBase.extend({

    tagName: 'tr',

    className: 'item',

    browse_tab: function(){
      return this.parent.browse;
    },

    events:{
      'click a': '$open'
    },

    $open: function(e){
      e.preventDefault();
      if(this.model.has_children()){
        if(this.parent.prefix !== 'list'){
          this.open_list_item();
        }else{
          var result = this.parent.browse.tree_view.click_item_by_id(this.model.id);
          if(!result){
            this.open_list_item_with_root();
          }
        }
      }
    },

    open_list_item: function(){
      var items = new Items();
      items.browser = this.parent.browser;

      items.fetch_list_model_id(this.model.id, {
        success: function(){
          this.parent.collection.reset(items.models);
          this.show_search_breadcrumb(items);
        }.bind(this)
      });
    },

    open_list_item_with_root: function(){
      var items = new Items();
      items.browser = this.parent.browser;

      this.setup_root_model();

      items.fetch_list_model_id(this.model.id, {
        success: function(){
          this.parent.collection.reset(items.models);
          this.show_breadcrumb(items);
        }.bind(this)
      });
    },

    setup_root_model: function(){
      this.parent.browse.root_model = this.model;
      this.parent.browse.root_model.is_root_model = true;
    },

    show_breadcrumb: function(collection){
      this.parent.browse.render_breadcrumb(collection);
    },

    show_search_breadcrumb: function(collection){
      this.parent.browse.render_search_breadcrumb(collection);
    }

  });

});

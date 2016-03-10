define(['view', './list_base', 'collections/items'], function(View, ListBase, Items){
  'use strict';

  return View.extend(ListBase).extend({
    tagName: 'tr',
    className: 'item',

    events:{
      'click a': '$open'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom();
      if(this.model.is_checked()){
        this.check_item();
      }

      return this;
    },

    setup_dom: function(){
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-type', this.model.type());
    },

    hide_columns_by_visibility: function(){
      var menu_items = this.parent.browse.menu_items.invisibles();
      menu_items.forEach(function(item){
        this.$('td[data-name="' + item.get('name') +  '"]').addClass('hidden');
      }.bind(this));
    },

    $open: function(e){
      e.preventDefault();
      if(this.model.has_children()){
        var result = this.parent.browse.tree_view.click_item_by_id(this.model.id);
        if(!result){
          this.open_item();
        }
      }
    },

    open_item: function(){
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

    $show_preview: function(){
      this.parent.browse.render_preview(this.model);
    },

    show_breadcrumb: function(collection){
      this.parent.browse.render_breadcrumb(collection);
    }

  });

});

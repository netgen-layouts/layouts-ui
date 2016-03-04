define(['view', 'collections/locations'], function(View, Locations){
  'use strict';

  return View.extend({
    template: 'browser/list_item',
    tagName: 'tr',
    className: 'item',

    events:{
      'click': 'show_preview',
      'click input': 'toogle_select',
      'click a': 'open'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom();
      if(this.model.is_checked()){
        this.check_item();
      }
      return this;
    },

    render: function(){
      View.prototype.render.apply(this, arguments);
      this.hide_columns_by_visibility();
      return this;
    },

    setup_dom: function(){
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-type', this.model.type());
    },

    hide_columns_by_visibility: function(){
      var menu_items = this.parent.browser.menu_items.invisibles();
      menu_items.forEach(function(item){
        this.$('td[data-name="' + item.get('name') +  '"]').addClass('hidden');
      }.bind(this));
    },

    open: function(e){
      e.preventDefault();
      if(this.model.has_children()){
        var result = this.parent.browser.tree_view.click_item_by_id(this.model.id);
        if(!result){
          this.open_item();
        }
      }
    },

    open_item: function(){
      var locations = new Locations();
      locations.browser = this.parent.browser;
      locations.fetch_list_model_id(this.model.id, {
        success: function(){
          this.parent.collection.reset(locations.models);
        }.bind(this)
      });
    },

    toogle_select: function(){
      if(this.model.is_checked()){
        this.uncheck_item();
        this.model.uncheck();
      }else{
        this.check_item();
        this.model.check();
      }
    },

    uncheck_item: function(){
      this.$el.removeClass('selected');
      this.$(':checkbox').prop('checked', false);
    },

    check_item: function(){
      this.$el.addClass('selected');
      this.$(':checkbox').prop('checked', true);
    },

    show_preview: function(){
      this.parent.browser.render_preview(this.model);
    }

  });

});

define(['view'], function(View){
  'use strict';

  return View.extend({
    template: 'browser/list_item',
    tagName: 'li',
    className: 'item',

    events:{
      'click': 'item_click'
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
      this.$el.attr('data-type', this.model.get('kind'));
    },

    item_click: function(){
      if(this.model.is_checked()){
        this.uncheck_item();
        this.model.uncheck();
      }else{
        this.check_item();
        this.model.check();
        if(this.model.has_children()){
          this.parent.browser.tree_view.click_item_by_id(this.model.id);
        }
      }
    },

    uncheck_item: function(){
      this.$el.removeClass('selected');
      this.$(':checkbox').prop('checked', false);
    },

    check_item: function(){
      this.$el.addClass('selected');
      this.$(':checkbox').prop('checked', true);
    }

  });

});

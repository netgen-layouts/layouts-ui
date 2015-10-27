define(['view'], function(View){
  'use strict';

  return View.extend({
    template: 'browser/tree_item',
    tagName: 'li',
    className: 'item',

    events:{
      'click': 'open_tree'
    },

    open_tree: function(e){
      e.stopPropagation();

      if(!this.model.get('children_size')){ return; }
      if(this.open){
        this.open = false;
        this.$el.removeClass('open');
        return;
      }

      if(this.model.loaded){
        this.$el.addClass('open');
        this.open = true;
        return;
      }

      this.$el.addClass('loading');
      this.model.fetch({
        silent:true,
        success: function(){
          this.$el.removeClass('loading');
          this.$el.addClass('open');
          this.model.loaded = true;
          this.open = true;
          this.parent.browser.render_subtree(this.$('> ul'), this.model.children());
        }.bind(this)
      });

    },



  });

});

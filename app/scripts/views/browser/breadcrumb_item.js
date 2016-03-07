define(['view'], function(View){
  'use strict';

  return View.extend({
    template: 'browser/breadcrumb_item',
    tagName: 'li',
    className: function(){
      if(this.model.get('last')){
        return 'active';
      }
      return '';
    },

    events: {
      'click a': 'open'
    },

    open: function(e){
      e.preventDefault();

      var browser = this.parent.browser;
      console.log(this.model.id);

      if(browser.is_root(this.model.id)){
        var $item = $('.header-item a[data-id="' + this.model.id + '"]');
        if($item.length === 0){ return false; }
        $item.trigger('click');
      }else{
        var result = browser.tree_view.click_item_by_id(this.model.id);
        console.log(result);
        if(!result){
          browser.render_list_view(this.model);
        }
      }

    }

  });

});

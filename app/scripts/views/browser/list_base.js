define(['view'], function(View){
  'use strict';

  return {

    extend_with: ['browse'],

    template: 'browser/list_item',

    prevent_auto_render: true,

    events:{
      'click': '$show_preview',
      'click input': '$toogle_select'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom && this.setup_dom();
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

    hide_columns_by_visibility: function(){
      var menu_items = this.browse_tab().menu_items.invisibles();
      menu_items.forEach(function(item){
        this.$('td[data-name="' + item.get('name') +  '"]').addClass('hidden');
      }.bind(this));
    },

    $show_preview: function(){
      this.browse_tab().render_preview(this.model);
    },

    $toogle_select: function(){
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

  };

});

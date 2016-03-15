define(['view', 'app'], function(View, App){
  'use strict';

   return View.extend({

    extend_with: ['browse'],

    template: 'browser/list_item',

    prefix: 'root',

    events:{
      'click': '$show_preview',
      'click input': '$toogle_select'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom();
      if(this.model.is_checked()){
        this.check_item();
      }

      this.context.columns = this.browse_tab().columns;
      this.context.prefix = (this.parent && this.parent.prefix) || this.prefix;

      return this;
    },

    setup_dom: function(){
      this.$el.attr('data-id', this.model.id);
      this.$el.attr('data-type', this.model.type());
    },

    render: function(){
      View.prototype.render.apply(this, arguments);
      this.hide_columns_by_visibility();
      return this;
    },

    hide_columns_by_visibility: function(){
      var columns = this.browse_tab().columns.invisibles();
      columns.forEach(function(item){
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
      App.trigger('item:check_changed', this.model);
    },

    uncheck_item: function(){
      this.$el.removeClass('selected');
      this.$(':checkbox').prop('checked', false);
    },

    check_item: function(){
      this.$el.addClass('selected');
      this.$(':checkbox').prop('checked', true);
    },

  });

});

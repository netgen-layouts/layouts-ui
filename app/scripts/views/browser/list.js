define(['underscore', 'app', 'view', './list_item'], function(_, App, View, ListItem){
  'use strict';

  return View.extend({

    template: 'browser/list',

    extend_with: ['browser', 'browse'],

    view_items_el: 'tbody',

    ViewItem: ListItem,

    events: {
      'contextmenu': '$show_dropdown_menu',
      'change input[type="checkbox"]': '$toggle_table_columns'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);

      this.context.columns = this.browse.columns;

      App.on('browser:click', this.hide_dropdown_menu);

      this.listenTo(this.collection, 'reset', this.render);

      return this;
    },

    $show_dropdown_menu: function(e){
      e.preventDefault();
      $('.dropdown-menu').css({
        display: 'block',
        left:  e.pageX - $('.list').offset().left,
        top: e.pageY - $('.list').offset().top
     });
    },

    hide_dropdown_menu: function(){
      $('.dropdown-menu').hide();
    },

    $toggle_table_columns: function(e){
      var name = e.target.name,
          $th = this.$('th[data-name="' + name + '"]'),
          $td = this.$('td[data-name="' + name + '"]');

      if(e.target.checked){
        $th.removeClass('hidden');
        $td.removeClass('hidden');
      }else{
        $th.addClass('hidden');
        $td.addClass('hidden');
      }

      this.browse.columns.save_visibility(name, e.target.checked);

      this.hide_dropdown_menu();
    },

  });

});

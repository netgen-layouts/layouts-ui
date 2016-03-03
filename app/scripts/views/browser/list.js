define(['underscore', 'app', 'view', './list_item'], function(_, App, View, ListItem){
  'use strict';

  return View.extend({

    template: 'browser/list',

    extend_with: ['browser'],

    view_items_el: 'tbody',

    ViewItem: ListItem,

    events: {
      'contextmenu': 'show_menu',
      'change input[type="checkbox"]': 'toggle_columns'
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);

      this.context.menu_items = this.browser.menu_items;

      App.on('browser:click', this.hide_menu);

      this.listenTo(this.collection, 'reset', this.render);

      return this;
    },

    show_menu: function(e){
      e.preventDefault();
      $('.dropdown-menu').css({
        display: 'block',
        left:  e.pageX - $('.list').offset().left,
        top: e.pageY - $('.list').offset().top
     });
    },

    hide_menu: function(){
      $('.dropdown-menu').hide();
    },

    toggle_columns: function(e){
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

      this.browser.menu_items.save_visibility(name, e.target.checked);

      this.hide_menu();
    },

  });

});

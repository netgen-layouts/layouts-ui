define(['underscore', './base', 'app'], function(_, Base, App){
  'use strict';

  return Base.extend({
    form_namespace: 'group',
    prevent_auto_render: true,

    events: {
      // 'mouseenter': '$mouseenter',
      // 'mouseleave': '$mouseleave'
    },

    $mouseenter: function(){
      $(document.body).addClass('group_edit');
      this.$el.addClass('xray');
      return this;
    },

    $mouseleave: function(){
      $(document.body).removeClass('group_edit');
      this.$el.removeClass('xray');
      return this;
    },

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.on('render', this.after_render);
      this.listenTo(this.model, 'save:success', this.after_save);
      return this;
    },

    after_save: function(){
      this.update_positions();
      return this;
    },

    after_render: function(){
      console.log('after_render');
      App.blocks.load_blocks(this);
    }


  });
});

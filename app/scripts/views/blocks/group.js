define(['underscore', 'backbone', './base', 'app'], function(_, Backbone, Base, App){
  'use strict';

  return Base.extend({

    events: {
      // 'mouseenter': '$mouseenter',
      // 'mouseleave': '$mouseleave'
    },

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.on('render', this.after_render);
      this.listenTo(this.model, 'save:success', this.after_save);
      return this;
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

    after_save: function(){
      this.update_positions();
      return this;
    },

    after_render: function(){
      App.blocks.load_group_blocks(this);
    },

    render: function(){
      this.render2();
      Base.prototype.render.apply(this, arguments);
      return this;
    },

    render2: function(){
      console.log(this.context);
      this.$el.attr('data-block', '')
      .attr('data-type', this.model.get('template').get('kind'))
      .prepend(JST['block_actions'](this.context)) // jshint ignore:line
      .prepend(JST['block_template'](this.context)); // jshint ignore:line
      this.trigger_render();
     }

  });
});

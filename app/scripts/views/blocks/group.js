define(['underscore', 'backbone', './base', 'app'], function(_, Backbone, Base, App){
  'use strict';

  return Base.extend({

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
      App.blocks.load_group_blocks(this);
    },

    render: function(){
      if(!this.model.id){ return this; }
      this.context.model  = this.model;
      this.$el.html(this.model.get('html'));
      this.render2();

      return this;
    },

    render2: function(){
      this.$el.attr('data-block', '')
      .attr('data-type', this.model.get('template').get('kind'))
      .prepend(JST['block_actions'](this.context)) // jshint ignore:line
      .prepend(JST['block_template'](this.context)); // jshint ignore:line
      this.trigger_render();
    }

  });
});

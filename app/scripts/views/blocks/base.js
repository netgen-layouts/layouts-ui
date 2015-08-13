define(['view', 'views/modal', 'app'], function(View, Modal, App){
  'use strict';

  return View.extend({

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.on('render', this.update_positions);
    },

    template: function(){
      return 'blocks/'+this.model.get('template').get('template');
    },

    events: {
      'click .action-edit': '$edit',
      'click .action-destroy': '$destroy'
    },

    render: function(){
      $.get(this.model.html_url())
        .done(function(resp){
          this.$el.html(resp);
          this.render2();
        }.bind(this));
      return this;
    },

    render2: function(){
      this.$el.attr('data-block', '');
      this.$el.prepend(JST['block_actions']());
      this.trigger_render();
    },

    $edit: function(e){
      new Modal({}).open();
      return this;
    },


    update_positions: function(){
      this.model.changed.id && App.trigger('positions:update');
    },

    $destroy: function(){
      console.log(this.model);
      var self = this;
      new Modal({
        body: 'Are you sure you want to delete?',
        context: { title: 'Confirm' }
      }).on('apply', function(){
        self.remove();
        self.model.destroy();
        App.trigger('positions:update');
      }).open();
    }

  });

});

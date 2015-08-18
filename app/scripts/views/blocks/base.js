define(['view', 'views/modal', 'app'], function(View, Modal, App){
  'use strict';

  return View.extend({

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.on('render', this.update_positions);
      console.log(this.model.id);
      !this.model.isNew() && this.model.fetch();
    },


    events: {
      'click > .block_actions .action-edit': '$edit',
      'dblclick > .block_actions .action-destroy': '$fast_destroy'
      // 'click > .block_actions .action-destroy': '$destroy'
    },

    render: function(){
      View.prototype.render.apply(this, arguments);
      $.get(this.model.html_url())
        .done(function(resp){
          this.$el.html(resp);
          this.render2();
        }.bind(this));
      return this;
    },

    render2: function(){
      this.$el.attr('data-block', '');
      this.$el.attr('data-type', this.model.get('type_name'));
      this.$el.prepend(JST['block_actions'](this.context));
      this.trigger_render();
    },

    $edit: function(){
      var self = this;
      $.get(this.model.new_or_edit_url())
        .done(function(response){

         new Modal({
            context: {
              body: response
            }
          }).on('apply', function(){
            self.$submit(null, this);
          }).open();
        });

      return this;
    },


    update_positions: function(){
      var self = this;
      self.model.changed.id && App.trigger('positions:update');
    },

    $destroy: function(){
      var self = this;
      new Modal({
        body: 'Are you sure you want to delete?',
        context: { title: 'Confirm' }
      }).on('apply', function(){
        self.remove();
        self.model.destroy();
        App.trigger('positions:update');
      }).open();
    },

    $submit: function (e, modal) {
      e && e.preventDefault();
      var params = modal.serialize().params[this.form_namespace];
      this.model.save(params);
    },

    $fast_destroy: function(){
      this.remove();
      this.model.destroy();
      App.trigger('positions:update');
    }

  });

});

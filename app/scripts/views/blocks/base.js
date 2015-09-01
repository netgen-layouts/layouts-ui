define(['underscore', 'view', 'views/modal', 'views/form_modal', 'app', 'models/blocks/base'], function(_, View, Modal, FormModal, App, BaseModel){
  'use strict';

  return View.extend({

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.on('render', this.update_positions);
      !this.model.isNew() && this.model.fetch();
    },


    events: {
      'click > .block_actions .action-edit': '$edit',
      //'dblclick > .block_actions .action-destroy': '$fast_destroy'
       'click > .block_actions .action-destroy': '$destroy'
    },

    render: function(){
      View.prototype.render.apply(this, arguments);

      this.$el.html(this.model.get('html'));
      this.$el.attr('data-block', '');
      this.$el.attr('data-type', this.model.get('template').get('kind'));
      this.$el.prepend(JST['block_actions'](this.context)); // jshint ignore:line
      return this;
    },


    $edit: function(){

      new FormModal({
        form_namespace: this.form_namespace,
        model: this.model
      });

      this.model.fetch({via: 'edit'});

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

        if(self.model.is_group()){
          var kind, block;
          var block_ids = _.pluck(self.model.get('parameters'), 'block_id');
          _.each(block_ids, function(block_id){
            kind = self.$('[data-block='+ block_id +']').find('[data-type]').data('type');
            block = App.model_helper.init_block_kind(block_id, kind);
            block.destroy();
          });
        }

        self.remove();
        self.model.destroy({
          success: function(){
            App.trigger('block:destroy', self.model);
          }
        });

        App.trigger('positions:update');
      }).open();
    },

    $fast_destroy: function(){
      this.remove();
      this.model.destroy();
      App.trigger('positions:update');
    }

  });

});

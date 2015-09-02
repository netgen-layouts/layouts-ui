define(['underscore', 'view', 'views/modal', 'views/form_modal', 'app'], function(_, View, Modal, FormModal, App){
  'use strict';

  return View.extend({

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.setup_dom_element();
      this.on('render', this.update_positions);
      !this.model.isNew() && this.model.fetch();
    },


    events: {
      'click > .block_actions .action-edit': '$edit',
      //'dblclick > .block_actions .action-destroy': '$fast_destroy'
       'click > .block_actions .action-destroy': '$destroy'
    },

    setup_dom_element: function(){
      this.$el
        .attr('data-block', '')
        .attr('data-type', this.model.get('template').get('kind'));
      return this;
    },

    render: function(){
      View.prototype.render.apply(this, arguments);
      this.$el.html(this.model.get('html'));
      this.$el.prepend(JST['block_actions'](this.context)); // jshint ignore:line
      return this;
    },

    $section_el: function(){
      return this.$el.parents('[data-type="Section"]');
    },

    is_in_section: function(){
      return this.$section_el().length;
    },

    section: function(){
      return this.is_in_section() && this.$section_el().data('_view');
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
      console.warn('IN SECTION? ', this.is_in_section());
      if(this.model.changed.id){
        console.info('Block base: update_positions');
        if(this.is_in_section()){
          console.info('in section: save_positions');
          this.section().save_positions();
          return;
        }else{
          App.trigger('positions:update');
        }
      }



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

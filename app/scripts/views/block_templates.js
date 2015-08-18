define(['underscore', 'view', './block_template', 'models/blocks/main', './blocks/main', 'app'], function(_, View, ViewBlockTemplate, Blocks, ViewBlocks, App) {
  'use strict';

  return View.extend({
    ViewItem: ViewBlockTemplate,

    render: function() {
      View.prototype.render.apply(this, arguments);
      this.render_items();
      this.dnd();
      return this;
    },

    initialize_block: function(template){
      console.log(template.attributes);
      var Klass = Blocks[template.get('kind')] || Blocks.Def;
      var attributes = _.defaults({template_id: template.id}, template.get('parameters'));
      return new Klass(attributes);
    },

    load_blocks: function(){
      var self = this;
      _.each(App.g.layout.get('positions'), function(position){
        _.each(position.blocks, function(item){

          var block_template = App.g.block_templates.get(item.block_type_id);
          var block = self.initialize_block(block_template);

          if(item.block_id){
            block.set({id: item.block_id});
          }

          var ViewBlockKlass = ViewBlocks[block_template.get('kind')] || ViewBlocks.Def;
          var view_block = new ViewBlockKlass({
            model: block
          });
          $('[data-zone='+ position.zone  +']').append(view_block.render().$el);
        });

      });
    },

    dnd: function() {
      var self = this;

      $('[data-zone]').sortable({
        connectWith: '[data-zone]',
        placeholder: 'no-placeholder',
        handle: '.handle',
        tolerance: 'pointer',
        cursorAt: { left: 5 },
        delay: 150,
        distance: 20,
        // forceHelperSize: true,
        // helper: function(e, item){
        //   var view = $(item).data('_view');
        //   console.log(view);
        //   var helper = $('<div>'+view.model.template().get('name')+'</div>');
        //   helper.css({'width': '100px', 'height': '100px'});
        //   return helper;
        // },

        start: function( event, ui ) {
          App.trigger('sortable:start');
          $( this ).sortable( 'refreshPositions' );
        },

        stop: function(){
          App.trigger('sortable:end');
          App.trigger('positions:update');
          console.log('STOP', this, arguments);
        },
        receive: function(e, ui) {
          console.log('receive', this, arguments);

          var zone_view = $(this).data('_view');
          var block_template_view = $(ui.item).data('_view');
          var block_template = block_template_view.model;
          var block = block_template.has('template_id') && block_template;
          var zone = zone_view.model;

          console.log('block model', block_template_view.model);
          console.log('block', block);

          // if(block){
          //   console.warn('cancel')
          //   $(ui.sender).sortable('cancel');
          //   return false;
          // }


          console.log(zone.should_accept(block_template));
          if(zone.is_inherited()){
            $(ui.sender).sortable('cancel');
            return false;
          }
          if(!zone.should_accept(block_template)){
            $(ui.sender).sortable('cancel');
            return;
          }


          ui.sender.data('copied', true);

          if(block){

          }else{
            block = self.initialize_block(block_template, {
              template_id: block_template.id
            });

            var ViewBlockKlass = ViewBlocks[block.template().get('kind')] || ViewBlocks.Def;
            var view_block = new ViewBlockKlass({
              model: block
            });
            console.log(block);
            ui.item.after(view_block.render().$el);
            ui.item.remove();
          }


          App.trigger('positions:update');


        }
      });

      $('.blocks').sortable({
        connectWith: '[data-zone]',
        placeholder: 'no-placeholder',
        receive: function(e, ui){
          console.log(ui.sender, this);
        },

        helper: function (e, item) {
            this.copyHelper = item.clone(true).insertAfter(item);
            $(this).data('copied', false);
            return item.clone();
        },

        start: function(){
          App.trigger('sortable:start');
        },

        stop: function (e) {
            App.trigger('sortable:end');
            var copied = $(this).data('copied');

            if(!copied){
              e.preventDefault();
              this.copyHelper.remove();
            }
            this.copyHelper = null;
        }
      });

      return this;
    }





  });

});

define(['underscore', 'app', './main'], function(_, App, ViewBlocks){
  'use strict';

   return {

    create_view: function(kind, model){
      var ViewBlockKlass = ViewBlocks[kind] || ViewBlocks.Def;
      return new ViewBlockKlass({
        model: model
      });
    },

    load_layout_blocks: function(){
      _.each(App.g.layout.get('positions'), function(position){
        _.each(position.blocks, function(item){

          var block_attr = App.g.layout.get_block_by_id(item.block_id);
          var block = App.model_helper.init_block(block_attr);

          var view_block = App.blocks.create_view(block.template().get('kind'), block);

          $('[data-zone='+ position.zone  +']').append(view_block.$el);
        });

      });
    },

    load_group_blocks: function(view_group){
      var self = this;
      view_group.$('[data-block]').each(function(n, item){
        var json = $(item).text().trim();
        if(!json){return;}
        var data = JSON.parse(json);

        var block = App.model_helper.init_group_block(data);

        if(data.block_id){
          block.set({id: data.block_id});
        }

        block.group = view_group.model;

        var view_block = self.create_view(data.type, block);

        $(item).html(view_block.$el);
      });
    },

    load_container_blocks: function(container_view){
      container_view.children = [];
      container_view.dom_elements = [];
      console.log(container_view.model.get('positions'));
      _.each(container_view.model.get('positions'), function(item){


          var block_template = App.g.block_templates.get(item.block_type_id),
              block = App.model_helper.init_block(block_template, {
                container_id: container_view.model.id,
                id: item.block_id ? item.block_id : null
              }),
              child = this.create_view(block.template().get('kind'), block);

          container_view.dom_elements.push(child.$el);
      }, this);

    }
  };

});

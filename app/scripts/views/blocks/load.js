define(['underscore', 'app', './main'], function(_, App, ViewBlocks){
  'use strict';

   return {

    create_view: function(kind, model){
      var ViewBlockKlass = ViewBlocks[kind] || ViewBlocks.Def;
      return new ViewBlockKlass({
        model: model
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

    load_section_blocks: function(section){
      var self = this;
      _.each(section.model.get('positions'), function(item){

          var block_template = App.g.block_templates.get(item.block_type_id);
          var block = App.model_helper.init_block(block_template);

          if(item.block_id){
            block.set({id: item.block_id});
          }

          var view_block = self.create_view(block.template().get('kind'), block);

          view_block.on('render', function(){
            section.$('[data-section]').append(view_block.$el);
          });
      });

    }
  };

});

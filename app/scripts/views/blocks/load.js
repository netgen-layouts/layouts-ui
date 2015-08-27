define(['underscore', 'app', './main'], function(_, App, ViewBlocks){
  'use strict';

   return {

    load_blocks: function(view_group){

      view_group.$('[data-block]').each(function(n, item){

          var json = $(item).text().trim();
          if(!json){return;}
          var data = JSON.parse(json);

          var block = App.model_helper.init_group_block(data);

          if(data.block_id){
            block.set({id: data.block_id});
          }

          block.group = view_group.model;

          var ViewBlockKlass = ViewBlocks[data.type] || ViewBlocks.Def;
          var view_block = new ViewBlockKlass({
            model: block
          });

          $(item).html(view_block.$el);
        });

    }
  };

});

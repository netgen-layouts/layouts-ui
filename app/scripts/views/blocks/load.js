define(['underscore', 'models/blocks/main', './main'], function(_, Blocks, ViewBlocks){
  'use strict';

   return {
    initialize_block: function(data){
      var Klass = Blocks[data.type] || Blocks.Def;
      var attributes = _.defaults({template_id: 1, in_group: true, label: data.label}, data.attributes);
      return new Klass(attributes);
    },

    load_blocks: function(view_group){
      var self = this;

      console.log(view_group.model);

      view_group.$('[data-block]').each(function(n, item){

          var json = $(item).text().trim();
          console.log(item);
          if(!json){return;}
          var data = JSON.parse(json);
          console.log(data);

          var block = self.initialize_block(data);

          console.log('Block:', block);

          if(data.block_id){
            block.set({id: data.block_id});
          }
          console.debug(view_group.model);
          block.group = view_group.model;

          var ViewBlockKlass = ViewBlocks[data.type] || ViewBlocks.Def;
          var view_block = new ViewBlockKlass({
            model: block
          });

          console.log(item);
          $(item).html(view_block.$el);
        });

    }
  };

});

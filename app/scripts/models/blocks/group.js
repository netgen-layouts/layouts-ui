define(['./base', 'app'], function(Block, App){
  'use strict';

  return Block.extend({
    path: 'groups',

    html_url: function(){
      return this.urlRoot() + '/' + this.id +  '?ajax=true';
    },

    parse: function (response) {
      console.log(response);
      response.parameters = JSON.parse(response.parameters);
      return response;
    },

    save_group: function(){
      var self = this,
      params = [],
      count = this.get('blocks').length;

      this.get('blocks').forEach(function(data){
        var block = App.model_helper.init_group_block(data);
        block.save(null, {
          success: function(){
            params.push({
              label: data.label,
              block_id: block.id
            });

            count--;

            if(count === 0){
              self.save({
                parameters: JSON.stringify(params)
              });
            }
          }
        });
      });
    }

  });

});

define(['underscore', './base', 'app'], function(_, Block, App){
  'use strict';

  return Block.extend({
    path: 'groups',

    html_url: function(){
      if(this.isNew()){
        return this.urlRoot() + '/dummy?ajax=true&block[template]=' + this.template_name_from_params();
      }else{
        return this.urlRoot() + '/' + this.id +  '?ajax=true';
      }
    },

    parse: function (response) {
      response.parameters = response.parameters ? JSON.parse(response.parameters) : [];
      return response;
    },

    is_container: function(){
      return this.get('as_container');
    },

    save_group: function(){
      var self = this;

      $.get(this.html_url())
        .done(function(resp){
          var blocks = [], params = [], count;

          var re = /<div data-block="0">.*?<\/div>/ig;
          var json = resp.match(re);

          for (var i = 0; i < json.length; i++) {
            blocks.push(JSON.parse($(json[i]).text()));
          }

          count = blocks.length;

          _.each(blocks, function(data){
            var block = App.model_helper.init_group_block(data);

            block.save(null, {
              success: function(model){
                params.push({
                  label: model.get('label'),
                  block_id: model.id,
                  block_type_id: model.get('block_type_id')
                });

                count--;

                if(!count){
                  self.save({
                    parameters: JSON.stringify(params)
                  });
                }
              }
            });
          });


        }.bind(this));
    }

  });

});

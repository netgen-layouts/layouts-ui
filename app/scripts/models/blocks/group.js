define(['underscore', 'model', './base', 'app'], function(_, Model, Block, App){
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
      response.params = response.params ? JSON.parse(response.params) : [];
      return response;
    },

    is_container: function(){
      return this.get('as_container');
    },

    get_params: function(){
      return this.get('parameters') && this.get('parameters').params && JSON.parse(this.get('parameters').params);
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

            block.save({zone_id: self.get('zone_id')}, {
              success: function(model){
                params.push({
                  label: model.get('label'),
                  block_id: model.id
                });

                count--;

                if(!count){
                  self.save({ params: params });
                }
              }
            });
          });


        }.bind(this));
    },

    toJSON: function(options){
      options || (options = {});
      var json = Block.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      !_.isString(json.group.params) && (json.group.params = JSON.stringify(json.group.params));
      return json;
    }

  });

});

define(['underscore', 'model', 'app', 'collections/blocks'], function(_, Model, App, Blocks){
  'use strict';

  return Model.extend({

    path: 'layouts',

    initialize: function(){
      Model.prototype.initialize.apply(this, arguments);
      this.blocks = new Blocks();
      this.blocks.url = App.env.base_url + this.path + '/' + this.id + '/blocks';
      return this;
    },

    // parse: function (response) {
    //   response.positions = response.positions ? JSON.parse(response.positions) : {};
    //   response.blocks && this.initialize_blocks(response);
    //   return response;
    // },


    // initialize_blocks: function(response){
    //   _.each(response.blocks, function(params){
    //     this.blocks.add(App.model_helper.init_block(params));
    //   }, this);

    //   delete(response.blocks);
    // },


    toJSON: function(options){
      options || (options = {});
      var json = Model.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      json.positions = JSON.stringify(json.positions);
      return json;
    },

    inherited_zones: function(){
      return _.where(App.g.layout.get('zones'), {kind: 2});
    },

    get_block_by_id: function(id){
      return App.g.layout.get('blocks').get(id);
    }

  });

});

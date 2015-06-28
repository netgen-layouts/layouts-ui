define(['underscore', 'model', './blocks/main',  'app'], function(_, Model, Blocks, App){
  'use strict';

  return Model.extend({
    initialize: function(attributes){
      var params = this.get('template').get('params');

      Model.prototype.initialize.call(this, attributes);
      // _.defaults(this.attributes, defaults);
      this.initialize_resource(params);
      return this;
    },


    initialize_resource: function(attributes){
      var Klass = Blocks[this.get('template').get('type')] || Blocks.Def;
      this.resource = new Klass(attributes);
      return this;
    },

    template: function(){
      return App.g.block_templates.get(this.get('template_id'));
    },

    toString: function(){
      return JSON.stringify(this.toJSON());
    }


  });

});

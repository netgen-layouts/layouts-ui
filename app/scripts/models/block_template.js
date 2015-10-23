define(['model'], function(Model){
  'use strict';

  return Model.extend({

    format: 'json',
    path: 'block_types',

    GROUPS: {
      0: 'simple',
      1: 'content',
      2: 'group',
      3: 'container',
      4: 'custom'
    },

    group_name: function(){
      return this.GROUPS[this.get('group')];
    },


    parse: function (response) {
      response.parameters = response.parameters ? JSON.parse(response.parameters) : {};
      return response;
    },

    toJSON: function(options){
      options || (options = {});
      var json = Model.prototype.toJSON.apply(this, arguments);
      if(!options.parse){return json;}
      json.parameters = JSON.stringify(json.parameters);
      return json;
    },

    is_group: function(){
      return this.kind_of('Group');
    },

    is_container: function(){
      return this.kind_of('Container');
    },

    is_custom: function(){
      return this.kind_of('Custom');
    },

    kind_of: function(kind){
      return this.get('kind') === kind;
    },

    as_container: function(){
      return this.param() && this.param().as_container;
    }

  });

});

define(['model', 'app'], function(Model, App){
  'use strict';

  return Model.extend({

    idAttribute: 'identifier',

    types: function(){
      return this._block_types || (this._block_types = this.get('block_types').map(function(block_type){
        return App.g.block_types.get(block_type);
      }));
    }

  });

});

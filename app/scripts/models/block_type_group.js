'use strict';

var Core = require('netgen-core');

module.exports = Core.Model.extend({

  idAttribute: 'identifier',

  types: function(){
    return this._block_types || (this._block_types = this.get('block_types').map(function(block_type){
      return Core.g.block_types.findWhere({identifier: block_type});
    }));
  }

});

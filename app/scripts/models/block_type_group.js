'use strict';

var Core = require('core_boot');

module.exports = Core.Model.extend({

  idAttribute: 'identifier',

  types: function(){
    return this._block_types || (this._block_types = this.get('block_types').map(function(block_type){
      return Core.g.block_types.get(block_type);
    }));
  }

});

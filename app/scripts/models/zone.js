'use strict';

var Core = require('core_boot');
var _ = require('underscore');

module.exports = Core.Model.extend({

  idAttribute: 'identifier',

  TYPES: {
    1: 'normal',
    2: 'inherited'
  },

  type_name: function(){
    //return this.TYPES[this.get('kind')];
    return 'normal';
  },

  is_inherited: function(){
    //return this.get('kind') === 2;
    return  false;
  },

  should_accept: function(type_or_block){
    var allowed = this.get('allowed_block_definitions');
    if(allowed){ return true; }
    var id = type_or_block.get('identifier') || type_or_block.id;
    return _.contains(allowed, id);
  }
});

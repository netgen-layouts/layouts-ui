'use strict';

var Core = require('../core');
var $ = Core.$;
var BlockType = require('../models/block_type');
var BlockTypeGroups = require('./block_type_groups');

module.exports = Core.Collection.extend({
  model: BlockType,
  name: 'BlockTypes',

  parse: function(response){
    this.groups = new BlockTypeGroups(response.block_type_groups);
    return response.block_types;
  },

  by_group: function(){
    return this._by_group || (this._by_group = this.groupBy(function(item){return item.group_name();}));
  }

});

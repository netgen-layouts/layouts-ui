'use strict';

var Core = require('../../core');
var Blocks = require('./main');

module.exports = {
  init_group_block: function(data){
    var Klass = Blocks[data.kind] || Blocks.Def;
    var block_type = Core.g.block_types.findWhere({kind: data.kind});
    var type = (block_type && block_type.id) || 1;
    var attributes = Core._.defaults({identifier: type, in_group: true, label: data.label}, data.attributes);
    return new Klass(attributes);
  },

  init_block_from_type: function(type, additional_attributes){
    var Klass = Blocks[type.get('kind')] || Blocks.Def;
    var attributes = Core._.defaults({definition_identifier: type.get('definition_identifier')}, type.get('parameters'), additional_attributes);
    return new Klass(attributes);
  },

  init_block: function(params){
    var block_type = Core.g.block_types.get(params.block_type);
    var Klass = Blocks[block_type.get('kind')];
    console.log(params);
    return new Klass(params);
  },

  init_block_kind: function(id, kind){
    var Klass = Blocks[kind] || Blocks.Def;
    return new Klass({id: id});
  }
};

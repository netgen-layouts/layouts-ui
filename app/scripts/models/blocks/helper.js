define(['underscore', './main'], function(_, Blocks){
  'use strict';

  return {
    init_group_block: function(data){
      var Klass = Blocks[data.type] || Blocks.Def;
      var attributes = _.defaults({template_id: 1, in_group: true, label: data.label}, data.attributes);
      return new Klass(attributes);
    }
  };

});

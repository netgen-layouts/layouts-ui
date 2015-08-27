define(['underscore', './main', 'app'], function(_, Blocks, App){
  'use strict';

  return {
    init_group_block: function(data){
      var Klass = Blocks[data.type] || Blocks.Def;
      var block_template = App.g.block_templates.findWhere({kind: data.type});
      var type = (block_template && block_template.id) || 1;
      var attributes = _.defaults({template_id: type, in_group: true, label: data.label}, data.attributes);
      return new Klass(attributes);
    },

    init_block: function(template){
      var Klass = Blocks[template.get('kind')] || Blocks.Def;
      var attributes = _.defaults({template_id: template.id}, template.get('parameters'));
      return new Klass(attributes);
    },

    init_block_kind: function(id, kind){
      var Klass = Blocks[kind] || Blocks.Def;
      return new Klass({id: id});
    }
  };

});

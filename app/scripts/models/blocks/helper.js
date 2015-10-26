define(['underscore', './main', 'app'], function(_, Blocks, App){
  'use strict';

  return {
    init_group_block: function(data){
      var Klass = Blocks[data.kind] || Blocks.Def;
      var block_template = App.g.block_templates.findWhere({kind: data.kind});
      var type = (block_template && block_template.id) || 1;
      var attributes = _.defaults({block_type_id: type, in_group: true, label: data.label}, data.attributes);
      return new Klass(attributes);
    },

    init_block_from_template: function(template, additional_attributes){
      var Klass = Blocks[template.get('kind')] || Blocks.Def;
      var attributes = _.defaults({block_type_id: template.id}, template.get('parameters'), additional_attributes);
      return new Klass(attributes);
    },

    init_block: function(params){
      var block_type = App.g.block_templates.get(params.block_type_id);
      var Klass = Blocks[block_type.get('kind')];
      console.log(params);
      return new Klass(params);
    },

    init_block_kind: function(id, kind){
      var Klass = Blocks[kind] || Blocks.Def;
      return new Klass({id: id});
    }
  };

});

define(['underscore', 'model'], function(_, Model){
  'use strict';

  return Model.extend({
    TYPES: {
      1: 'normal',
      2: 'inherited'
    },

    type_name: function(){
      return this.TYPES[this.get('type')];
    },

    is_inherited: function(){
      return this.get('type') === 2;
    },

    should_accept: function(template_or_block){
      var id = template_or_block.get('template_id') || template_or_block.id;
      return _.contains(this.get('accepts'), id);
    }
  });

});

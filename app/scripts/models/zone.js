define(['underscore', 'model'], function(_, Model){
  'use strict';

  return Model.extend({
    TYPES: {
      1: 'normal',
      2: 'inherited'
    },

    type_name: function(){
      return this.TYPES[this.get('kind')];
    },

    is_inherited: function(){
      return this.get('kind') === 2;
    },

    should_accept: function(template_or_block){
      var accepts = this.get('accepts');
      console.log(accepts.length);
      if(accepts.length === 0){ return true; }
      var id = template_or_block.get('template_id') || template_or_block.id;
      return _.contains(accepts, id);
    }
  });

});

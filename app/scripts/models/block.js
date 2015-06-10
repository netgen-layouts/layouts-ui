define(['model', 'app'], function(Model, App){
  'use strict';

  return Model.extend({
    template: function(){
      return App.g.block_templates.get(this.get('template_id'));
    }
  });

});

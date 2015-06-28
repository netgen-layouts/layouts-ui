define(['view'], function(View){
  'use strict';

  return View.extend({
    template: function(){
      return 'blocks/'+this.model.resource.get('template');
    }
  });

});

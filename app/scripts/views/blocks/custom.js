define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    template: 'blocks/custom',

    /*
    render: function(){
      this.context.name = this.model.template().get('name');
      return Base.prototype.render.call(this, this.render_template());
    }
    */

  });

});

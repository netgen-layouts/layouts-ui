define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
      return this;
    },

    events: {
      'dblclick': '$click'
    },

    $click: function(){

      // this.model.set({content: 'Bla'});

    }

  });

});

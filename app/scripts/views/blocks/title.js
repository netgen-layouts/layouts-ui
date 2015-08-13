define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    events: {
      'blur .title': '$blur'
    },

    form_namespace: 'simple_block',

    $blur: function(){

      this.model.save({
        title: this.$('.title').text()
      });

    }

  });

});

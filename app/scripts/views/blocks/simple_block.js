define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    events: {
      'blur .simple-block': '$blur'
    },

    form_namespace: 'simple_block',

    $blur: function(){

      this.model.save({
        title: this.$('.simple-block').text().trim()
      });

    }

  });

});

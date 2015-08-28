define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    events: {
      'blur .simple-block': '$blur'
    },

    form_namespace: 'simple_block',

    $blur: function(e){
      e.preventDefault();

      this.model.save({
        title: this.$('.simple-block').text().trim()
      });

    }

  });

});

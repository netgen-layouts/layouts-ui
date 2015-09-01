define(['./base'], function(Base){
  'use strict';

  return Base.extend({

    form_namespace: 'simple_block',

    events: {
      'blur .simple-block': '$blur'
    },

    render: function(){
      Base.prototype.render.apply(this, arguments);
      this.content = this.$('.simple-block').text().trim();
      return this;
    },

    $blur: function(e){
      e.preventDefault();

      var text = this.$('.simple-block').text().trim();

      if(this.content !== text){
        this.model.save({
          title: text
        });
      }
    }

  });

});

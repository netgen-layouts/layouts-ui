define(['./base'], function(Base){
  'use strict';

  return Base.extend({
    form_namespace: 'image',

    events:{
      'drop .image-holder': '$drop'
    },

    render: function(){
      this.$el.css({minHeight: this.$el.height() });
      Base.prototype.render.apply(this, arguments);
      return this;
    },

    $drop: function(e){
      var image = e.originalEvent.dataTransfer.files;

      if(image.length){
        var form_data = new FormData();
        form_data.append('image[media]', image[0]);
        this.model.save({}, { form_data: form_data });
      }
    }

  });

});

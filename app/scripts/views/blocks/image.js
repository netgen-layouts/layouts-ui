define(['./base'], function(Base){
  'use strict';

  return Base.extend({
    form_namespace: 'image',

    events:{
      'drop .image-holder': '$drop'
    },

    render: function(){
      this.$el.css({minHeight: this.$el.height() });
      $.get(this.model.html_url())
        .done(function(resp){
          this.$el.html(resp);
          this.render2();
          this.$el.css({minHeight: null });
        }.bind(this));
      return this;
    },

    $drop: function(e){
      var image = e.originalEvent.dataTransfer.files;

      if(image.length){
        var form_data = new FormData();
        form_data.append('image[path]', image[0]);
        var method = this.model.isNew() ? 'POST' : 'PUT';
        this.upload_image(form_data, method);
      }
    },

    $submit: function (e, modal) {
      e && e.preventDefault();
      var form = modal.$('form').get(0);
      this.upload_image(new FormData(form), form.method);
    },

    upload_image: function(form_data, method){
      var self = this;
      $.ajax({
        url:         this.model.url(),
        type:        method,
        data:        form_data, // build payload from a Form element
        contentType: false,              // tell jQuery not to adjust content-type
        processData: false               // tell jQuery not to convert raw data to string
      }).done(function(data){
        self.model.set(data);
        self.render();
      });
    }
  });

});

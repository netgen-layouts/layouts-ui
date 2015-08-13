define(['./base', 'views/modal'], function(Base, Modal){
  'use strict';

  return Base.extend({

    events: {
      'blur .title': '$blur',
      'click .action-edit': '$edit',
    },

    $edit: function(){
      var self = this;
      $.get(this.model.new_or_edit_url())
        .done(function(response){

         new Modal({
            context: {
              body: response
            }
          }).on('apply', function(){
            self.$submit(null, this);
          }).open();
        });

      return this;
    },

    $submit: function (e, modal) {
      e && e.preventDefault();
      this.model.save({
        title: modal.$('#simple_block_title').val()
      }, {wait: true});
    },

    $blur: function(){

      this.model.save({
        title: this.$('.title').text()
      }, {wait: true});

    }

  });

});

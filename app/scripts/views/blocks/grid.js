define(['./base', 'views/modal', 'app'], function(Base, Modal, App){
  'use strict';

  return Base.extend({

    events: {
      'click .action-edit': '$edit',
      'click .action-destroy': '$destroy'
    },


    $edit: function(e){
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
      console.log(modal.$('form').serializeJSON().grid);
      this.model.save(modal.$('form').serializeJSON().grid, {wait: true});
    },

    /*$submit: function (e) {
      e && e.preventDefault();

      var self = this;
      console.log(self.model.update_url());

      var data = $('form').serialize();
        $.ajax({
          url: self.model.update_url(),
          data: data,
          type: 'POST'
        }).done(function(data){
          self.model.set(data);
          self.render();
          App.trigger('positions:update');
        });

    }*/
  });
});

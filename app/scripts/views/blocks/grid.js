define(['./base', 'views/modal'], function(Base, Modal){
  'use strict';

  return Base.extend({

    events: {
      'click .action-edit': '$edit',
      'click .action-destroy': '$destroy'
    },

    render: function(){
      var self = this;
      $.get(this.model.show_url())
        .done(function(resp){
          self.$el.html(resp);
          self.render2();
        });
      return this;
    },

    $edit: function(e){
      var self = this;
      $.get(this.model.get_url())
        .done(function(response){

          new Modal({
            context: {
              body: response
            }
          }).on('apply', function(){
            self.$submit();
          }).open();
        });

      return this;
    },

    $submit: function (e) {
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

    }
  });
});

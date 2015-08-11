define(['./base', 'views/modal'], function(Base, Modal){
  'use strict';

  return Base.extend({

    events: {
      'click .action-edit': '$edit',
      'click .action-destroy': '$destroy',
      'submit form': '$submit'
    },

    render: function(){
      var self = this;
      $.get(this.model.get('grid'))
        .done(function(resp){
          self.$el.html(resp);
          self.render2();
        });
      return this;
    },

    $edit: function(e){
      var self = this;
      $.get('http://localhost:3000/grids/1/edit?ajax=true')
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
      console.log(e);
      e && e.preventDefault();
      var self = this;
      var data = $('form').serialize();
        $.ajax({
          url: 'http://localhost:3000/grids/1.json',
          data: data,
          type: 'PUT'
        }).done(function(){
          self.render();
        });

    }
  });
});

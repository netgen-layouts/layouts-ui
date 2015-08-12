define(['./base', 'views/modal', 'app'], function(Base, Modal, App){
  'use strict';

  return Base.extend({

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
      return this;
    },

    events: {
      'blur .title': '$blur',
      'click .action-edit': '$edit',
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

    $edit: function(){
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

    },

    $blur: function(){
      var self = this;
      var type = this.model.id ? 'PUT' : 'POST';

      $.ajax({
        url:  self.model.update_url(),
        data: {
          simple_block: {
            title: self.$('.title').text()
          }
        },
        type: type
      }).done(function(data){
        self.model.set(data);
        self.render();
        App.trigger('positions:update');
      });
    }

  });

});

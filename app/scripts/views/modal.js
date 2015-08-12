define(['view'], function(View){
  'use strict';

  return View.extend({

    template: 'modal',

    className: 'mymodal modal fade',

    events: {
      'click .action_apply':  '$apply',
      'submit form': '$submit',
    },

    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      var self = this;
      this.$el.on('hidden.bs.modal', function(){
        self.remove();
        self.trigger('close');
      });
      return this;
    },


    set_context: function(){
      View.prototype.set_context.apply(this, arguments);
      //this.context.body = "Hello world 1";
      return this;
    },

    insert: function(){
      this.$el.appendTo(document.body);
      return this;
    },

    open: function(){
      this.render().insert().$el.modal({});
      this.trigger('open');
      return this;
    },

    close: function(){
      this.$el.modal('hide');
      //this.trigger('close');
    },

    $submit: function(e){
      e.preventDefault();
      this.$apply();
      return this;
    },



    $apply: function(e){
      e && e.preventDefault();
      this.trigger('apply');
      this.close();
      return this;
    },

  });

});

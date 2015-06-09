define(['view', './zone'], function(View, ViewZone){
  'use strict';

  return View.extend({
    initialize: function(){
      View.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, 'sync', this.parse_dom);
      return this;
    },

    parse_dom: function(){
      var id, self = this;;
      this.$('[data-zone]').each(function(){
        id = $(this).data('zone');
        new ViewZone({
          model: self.collection.get(id),
          el: this
        });
      });
      return this;
    },
  });

});

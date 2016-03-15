define(['backbone', 'localstorage'], function(Backbone){
  'use strict';

  return Backbone.Model.extend({
    save_visibility: function(visible){
      this.save({ visible: visible });
    }
  });

});

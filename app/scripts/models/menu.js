define(['backbone', 'localstorage'], function(Backbone){
  'use strict';

  return Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage('table_columns'),

    save_visibility: function(visible){
      this.save({ visible: visible });
    }
  });

});

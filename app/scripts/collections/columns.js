define(['underscore', 'backbone', 'app', 'models/column', 'localstorage'], function(_, Backbone, App, Column){
  'use strict';

  return Backbone.Collection.extend({

    model: Column,

    localStorage: new Backbone.LocalStorage('table_column'),

    save_visibility: function(name, checked){
      var model = this.findWhere({ column_id: name });
      model.save_visibility(checked);
    },

    invisibles: function(){
      return this.where({ visible: false });
    }

  });

});

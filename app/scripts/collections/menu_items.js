define(['underscore', 'backbone', 'app', 'models/menu', 'localstorage'], function(_, Backbone, App, Menu){
  'use strict';

  return Backbone.Collection.extend({

    model: Menu,

    localStorage: new Backbone.LocalStorage('table_columns'),

    save_default_columns: function(){
      if(!localStorage.getItem('default_saved')){
        var default_columns = App.g.tree_config.get('default_columns');
        var available_columns = App.g.tree_config.get('available_columns');

        _.each(available_columns, function(title, name){
          var menu = new Menu({
            name: name,
            title: title,
            visible: default_columns.indexOf(name) !== -1
          });
          menu.save();
        });

        localStorage.setItem('default_saved', true);
      }
    },

    save_visibility: function(name, checked){
      var model = this.findWhere({ name: name });
      model.save_visibility(checked);
    },

    invisibles: function(){
      return this.where({ visible: false });
    }

  });

});

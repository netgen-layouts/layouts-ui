define(['underscore', 'app', 'collection', 'models/location'], function(_, App, Collection, Location){
  'use strict';

  return Collection.extend({

    model: Location,

    name: 'Locations',

    fetch_root_model_id: function(id, options){
      this.fetch(_.extend({
        url: this.url() + '/' + id + '/categories'
      }, options));
    },

    fetch_tree_model_id: function(id, options){
      this.fetch(_.extend({
        url: this.url() + '/' + id + '/categories'
      }, options));
    },

    fetch_list_model_id: function(id, options){
      this.fetch(_.extend({
        url: this.url() + '/' + id + '/children'
      }, options));
    },

    select_model_by_id: function(id){
      this.each(function(item){
        if(item.id === id){
          item.select();
        }else{
          item.deselect();
        }
      });
    },

    selected_model: function(){
      return this.find(function(item){
        return item.selected;
      });
    }

  });

});

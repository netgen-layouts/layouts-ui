define(['underscore', 'app', 'backbone', 'collection', 'models/item', 'collections/breadcrumbs'], function(_, App, Backbone, Collection, Item, Breadcrumbs){
  'use strict';

  return Collection.extend({

    model: Item,

    name: 'Items',

    parse: function(response){
      if(response.children){
        this.path = new Breadcrumbs(response.path);
        return response.children;
      }else{
        return response;
      }
    },

    fetch_root_model_id: function(id, options){
      this._fetch_data(id, 'categories', options);
    },

    fetch_tree_model_id: function(id, options){
      this._fetch_data(id, 'categories', options);
    },

    fetch_list_model_id: function(id, options){
      this._fetch_data(id, 'children', options);
    },

    _fetch_data: function(id, postfix, options){
      var url = this.url() + '/' + id + '/' + postfix;
      this.fetch(_.extend({
        url: url
      }, options));
    },

    search_data: function(options){
      var url = App.env.cb_base_url + App.g.tree_config.name() +'/search';
      this.fetch(_.extend({
        url: url
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

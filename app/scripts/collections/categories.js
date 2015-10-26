define(['app', 'collection', 'models/category'], function(App, Collection, Category){
  'use strict';

  App.Categories = Collection.extend({
    url: 'simulate/categories.json',
    model: Category,
    name: 'Categories'
  });

  return App.Categories;

});

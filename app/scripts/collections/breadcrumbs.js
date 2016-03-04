define(['collection', 'models/breadcrumb'], function(Collection, Breadcrumb){
  'use strict';

  return Collection.extend({
    model: Breadcrumb
  });

});

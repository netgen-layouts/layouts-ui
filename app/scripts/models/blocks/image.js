define(['underscore', './base'], function(_, Block){
  'use strict';

  return Block.extend({
    urlRoot: 'http://localhost:3000/images',
    sync: function(method, model, options){
      options.form_data && _.extend(options, {
        data: options.form_data,
        contentType: false,              // tell jQuery not to adjust content-type
        processData: false               // tell jQuery not to convert raw data to string
      });

      return Block.prototype.sync.call(this, method, model, options);
    }
  });
});

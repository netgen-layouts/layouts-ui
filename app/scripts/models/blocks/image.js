'use strict';

var Core = require('core_boot');
var Block = require('./block');

module.exports = Block.extend({
  path: 'images',
  sync: function(method, model, options){
    options.form_data && Core._.extend(options, {
      data: options.form_data,
      contentType: false,              // tell jQuery not to adjust content-type
      processData: false               // tell jQuery not to convert raw data to string
    });

    return Block.prototype.sync.call(this, method, model, options);
  }
});

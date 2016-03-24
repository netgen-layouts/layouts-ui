'use strict';

var Core = require('core_boot');
var Block = require('./block');

module.exports = Block.extend({
  path: 'custom_actions',

  toJSON: function(options){
    options || (options = {});
    var json = Block.prototype.toJSON.apply(this, arguments);
    if(!options.parse){return json;}
    var namespace = this.get_namespace();
    !Core._.isString(json[namespace].params) && (json[namespace].params = JSON.stringify(json[namespace].params));
    return json;
  }
});

'use strict';

var Core = require('core_boot');
var Block = require('./block');

module.exports = Block.extend({
  path: 'containers',

  get_positions: function(){
    return this.param() && this.param().positions && JSON.parse(this.param().positions);
  },

  parse: function (response) {
    response.positions = response.positions ? JSON.parse(response.positions) : [];
    return response;
  },

  toJSON: function(options){
    options || (options = {});
    var json = Block.prototype.toJSON.apply(this, arguments);
    var namespace = this.get_namespace();
    if(!options.parse){return json;}
    !Core._.isString(json[namespace].positions) && (json[namespace].positions = JSON.stringify(json[namespace].positions));
    return json;
  }

});

'use strict';

var Core = require('../core');
var BmModel = require('./model');
var Zones = require('../collections/zones');
var _ = require('underscore');

module.exports = BmModel.extend({
  idAttribute: 'identifier',
  path: 'config/layout_types',

  parse: function(resp){
    if(resp && resp.zones){
      this.zones = new Zones(resp.zones);
    }

    return Core.Model.prototype.parse.apply(this, arguments);
  },

});

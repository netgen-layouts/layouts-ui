'use strict';

var Core = require('@netgen/layouts-core-ui');
var Zone = require('../models/zone');

module.exports = Core.Collection.extend({
  model: Zone,
  name: 'Zones',

  linked: function(){
    return this.filter(function(zone) {
      return zone.get('linked_layout_id');
    });

  },
});

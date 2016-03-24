'use strict';

var Core = require('core_boot');
var Zone = require('../models/zone');

module.exports = Core.Collection.extend({
  model: Zone,
  name: 'Zones'
});

'use strict';

var Core = require('core_boot');

module.exports = Core.Model.extend({
  defaults: {
    id: 1
  },

  url: '/bm/api/v1/config'
});

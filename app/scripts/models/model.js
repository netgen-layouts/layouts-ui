'use strict';

var Core = require('@netgen/layouts-ui-core');
var Env = require('../environments/default');

module.exports = Core.Model.extend({
  api_url: Env.bm_api_url,
});

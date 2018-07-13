'use strict';

var Core = require('@netgen/layouts-core-ui');
var Env = require('../environments/default');

module.exports = Core.Model.extend({
  api_url: Env.bm_api_url,
});

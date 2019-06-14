'use strict';

var Core = require('../core');
var $ = Core.$;

function normalize_path(path) {
  return path.replace(/\/+/g, '/');
}

var self = module.exports = {
  bm_base_path: $('meta[name="nglayouts-route-prefix"]').attr('content'),
  bm_base_app_path: '/app/',
  bm_base_api_path: '/app/api/',

  bm_api_url: function(path) {
    return normalize_path(self.bm_base_path + self.bm_base_api_path + path);
  },

  bm_app_url: function(path) {
    return normalize_path(self.bm_base_path + self.bm_base_app_path + path);
  }
};

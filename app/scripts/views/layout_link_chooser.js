'use strict';

var Core = require('../core');
var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'layout_link_chooser',
  events: {
    'change': '$load_layout'
  },

  $load_layout: function() {
    var params = _.extend({}, Core.router.params, this.serialize().params.layout);
    Core.router.navigate_to('layout_preview', params);
  }

});

'use strict';

var Core = require('netgen-core');
var _ = require('underscore');

module.exports = Core.View.extend({
  template: 'layout_type_chooser',
  events: {
    'change': '$load_layout'
  },

  $load_layout: function() {
    var id = this.serialize().params.layout_type.id;
    Core.router.navigate_to_params({layout_type_id: id});
  }

});

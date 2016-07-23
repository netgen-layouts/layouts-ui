'use strict';

var Core = require('core_boot');

module.exports = Core.Model.extend({
  defaults: {
    id: 1
  },


  mode_name: function() {
    return {
      'edit': 'Edit layout',
      'linking': 'Choose layout zone',
      'choosing': 'Link layout'
    }[this.get('mode')]
  }

});

'use strict';

var Core = require('core_boot');
var _ = require('underscore');

module.exports = Core.Model.extend({
  defaults: {
    id: 1
  },


  mode_name: function() {
    return {
      'edit': 'Edit layout',
      'edit_master': 'Edit master of layout',
      'linking': 'Choose layout zone',
      'choosing': 'Link layout'
    }[this.get('mode')] || this.get('mode');
  },

  in_mode: function(){
    return _.contains(arguments, this.get('mode'));
  },

});
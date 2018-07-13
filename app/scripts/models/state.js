'use strict';

var BmModel = require('./model');
var _ = require('underscore');

module.exports = BmModel.extend({
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


  detect_sidebar: function(){
    if(this.in_mode('linking')){
      return 'sidebar2';
    }else if(this.in_mode('choosing')){
      return 'sidebar3';
    }else{
      return 'sidebar';
    }

  },

});

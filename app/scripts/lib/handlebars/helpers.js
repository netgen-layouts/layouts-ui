'use strict';

var moment = require('moment');
var _ = require('underscore');

module.exports = {

  date: function(date, opts){
    return moment(date).format(opts.hash.format || 'llll');
  },

  log: function(something){
    console.log(something);
  },
};


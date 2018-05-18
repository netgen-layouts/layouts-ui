'use strict';

var moment = require('moment');
require('moment/min/locales.min');
var _ = require('underscore');

module.exports = {

  date: function(date, opts){
    return moment(date).locale(navigator.language || 'en-gb').format(opts.hash.format || 'llll');
  },

  log: function(something){
    console.log(something);
  },

  math: function(lvalue, operator, rvalue){
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        '+': lvalue + rvalue,
        '-': lvalue - rvalue,
        '*': lvalue * rvalue,
        '/': lvalue / rvalue,
        '%': lvalue % rvalue,
    }[operator];
  },
};


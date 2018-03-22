'use strict';

var Core = require('netgen-core');
var _ = require('underscore');
var MiniZoneView = require('./mini_zone');

module.exports = Core.View.extend({
  // template: 'layout_link_chooser',
  ViewItem: MiniZoneView

});

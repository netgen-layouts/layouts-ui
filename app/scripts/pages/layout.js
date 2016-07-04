'use strict';

var LayoutBasePage = require('./layout_base');
var ViewBlockTypes = require('../views/block_types');

module.exports = LayoutBasePage.extend({
  main: function(){
    LayoutBasePage.prototype.main.apply(this, arguments);

    new ViewBlockTypes({
      el: '.blocks',
      collection: Core.g.block_type_groups
    }).render();

    return this;
  },
});

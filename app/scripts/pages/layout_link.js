'use strict';
var LayoutBasePage = require('./layout_base');

module.exports = LayoutBasePage.extend({
  master: 'layout_link',

  main: function(){
    LayoutBasePage.prototype.main.apply(this, arguments);
    Core.g.layout.blocks.fetch({data: {published: true}});
    return this;
  },
});

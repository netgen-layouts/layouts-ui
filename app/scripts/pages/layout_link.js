'use strict';
var LayoutBasePage = require('./layout_base');
var LayoutLinkChooserView = require('../views/layout_link_chooser');


module.exports = LayoutBasePage.extend({
  master: 'application',
  layout: 'layout_link',

  main: function(){
    LayoutBasePage.prototype.main.apply(this, arguments);
    Core.g.layout.blocks.fetch({data: {published: true}});


    new LayoutLinkChooserView({
      collection: Core.g.shared_layouts,
    }).render_to('.app-center');

    return this;
  },
});

'use strict';
var LayoutBasePage = require('./layout_base');
var LayoutLinkChooserView = require('../views/layout_link_chooser');
var HeaderView = require('../views/header');



module.exports = LayoutBasePage.extend({
  master: 'application',
  layout: 'layout_link',

  main: function(){
    LayoutBasePage.prototype.main.apply(this, arguments);
    Core.g.layout.blocks.fetch({data: {published: true}});

    Core.state.set({mode: 'choosing'});



    new HeaderView({
      model: this.base_layout
    }).render_to('.app-center');

    new LayoutLinkChooserView({
      collection: Core.g.shared_layouts,
    }).render_to('.app-center .chooser');

    return this;
  },
});

'use strict';
var LayoutBasePage = require('./layout_base');
var LayoutLinkChooserView = require('../views/layout_link_chooser');
var HeaderView = require('../views/header');
var ZoneLinkingHeaderView = require('../views/zone_linking_header');



module.exports = LayoutBasePage.extend({
  master: 'application',
  layout: 'layout',

  main: function(){
    LayoutBasePage.prototype.main.apply(this, arguments);
    Core.g.layout.load_all_blocks({data: {published: true}});

    Core.state.set({mode: 'choosing', section: 'linking'});


    new ZoneLinkingHeaderView({
      el: '#zone_linking_header'
    });

    new HeaderView({
      model: this.base_layout,
      el: '.app-header',
    }).render();

    new LayoutLinkChooserView({
      collection: Core.g.shared_layouts,
    }).render_to('.layout-chooser');

    return this;
  },
});

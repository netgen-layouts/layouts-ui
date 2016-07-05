'use strict';

var Core = require('core_boot');
var Pages = require('./pages/main');

module.exports = Core.Backbone.Router.extend({


  before: function(name, params, next){
    // if(Core.g.layout){
    //   this.navigate_to('layout', {id: Core.g.layout.id});
    // }else{
    //   next();
    // }

    next();
  },

  routes: {
    '':       'home',
    'layout': 'layout_new',
    'layout/:id/link_zone/:zone_id/with_layout/:draft_layout_id': 'layout_preview',
    'layout/:id(/:type)': 'layout',
  },

  home: function() { this.navigate_to('layout_new'); },

  layout_new: Pages.LayoutNew.init(),

  layout:         Pages.Layout.init(),

  layout_preview: Pages.LayoutLink.init()

});

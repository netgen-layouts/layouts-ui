'use strict';

var Core = require('./core');
var $ = Core.$;
var Pages = require('./pages/main');

module.exports = Core.Backbone.Router.extend({


  before: function(name, params, next){
    $('.modal').modal('hide');
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
    'layout/:id/change_type(/:layout_type_id)': 'layout_change_type',
    'layout/:id/preview': 'preview',
    'layout/:id(/:type)(/:locale)': 'layout',
  },

  home: function() { this.navigate_to('layout_new'); },

  layout_new: Pages.LayoutNew.init(),

  layout:         Pages.Layout.init(),
  layout_edit_master: Pages.Layout.init(),

  layout_preview: Pages.LayoutLink.init(),

});

'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var LayoutBasePage = require('./layout_base');
var LayoutTypeChooserView = require('../views/layout_type_chooser');
var HeaderView = require('../views/header');
var ZoneLinkingHeaderView = require('../views/zone_linking_header');
var ZoneWrapperView = require('../views/zone_wrapper');
var ZoneView = require('../views/zone');
var Layout = require('../models/layout');


module.exports = LayoutBasePage.extend({
  master: 'application',
  layout: 'layout_change_type',


  deps: function(done){

    if(!Core.g.layout || Core.g.layout.id != Core.router.params.id){
      Core.g.layout = new Layout({id: parseInt(Core.router.params.id, 10)});
    }

    return  $.when(Core.g.config.fetch_once())
             .then(function() {
                return $.when(
                  Core.g.layout.fetch(),
                  Core.g.layout_types.fetch_once(),
                  Core.g.block_types.fetch_once()
                );
              })
              .then(function() {
                return $.when(
                  Core.g.layout.load_all_blocks()
                );
             })
             .then(done, done);
  },

  main: function(){

    var sidebar = Core.state.detect_sidebar();
    $('.right-sidebar').html(JST[sidebar]());

    Core.state.set({mode: 'change_type', section: 'change_type'});

    this.setup_zone_wrappers();

    new HeaderView({
      model: Core.g.layout
    }).render_to('.app-center');

    new LayoutTypeChooserView({
      collection: Core.g.layout_types,
    }).render_to('.chooser-layout-types');

    return this;
  },


  setup_zone_wrappers: function(){
    var new_layout_type = Core.g.layout_types.get(Core.router.params.layout_type_id);
    var current_layout_zones = Core.g.layout.zones;

    var $el = $('.zones');
    new_layout_type && $el.html(new_layout_type.get('html'));


    $el.find('[data-zone]').each(function(){
      var zone_id = $(this).data('zone');
      var zone_wrapper = new_layout_type.zones.get(zone_id);

      zone_wrapper.children = [];

      var zone = current_layout_zones.get(zone_id);
      zone && zone_wrapper.children.push(zone);

      new ZoneWrapperView({
        el: '[data-zone="'+zone_id+'"]',
        model: zone_wrapper
      }).render();

    });


    return this;
  },



});

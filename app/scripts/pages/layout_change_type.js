'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var LayoutBasePage = require('./layout_base');
var LayoutZoneChooserView = require('../views/layout_zone_chooser');
var HeaderView = require('../views/header');
var ZoneLinkingHeaderView = require('../views/zone_linking_header');
var ZoneWrapperView = require('../views/zone_wrapper');
var ZoneView = require('../views/zone');
var Layout = require('../models/layout');
var _ = require('underscore');


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
                  Core.g.layout.fetch_once(),
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
    this.new_layout_type = Core.g.layout_types.get(Core.router.params.layout_type_id);
    var zones, ids;

    var zones_with_blocks = Core.g.layout.zones.filter(function(z){ return z.has_blocks() })

    zones = this.zones = Core.g.layout.zones.new_from(zones_with_blocks).deep_clone()
    zones.update({mapped: true});

    if(this.new_layout_type){

      var ids = Core.g.layout.unmapped_zone_ids_for(this.new_layout_type);
      _.each(zones.get_by_ids(ids), function(zone){
        zone.set({mapped: false });
      });

      this.setup_zone_wrappers();
    }

    var sidebar = Core.state.detect_sidebar();
    $('.right-sidebar').html(JST[sidebar]());

    Core.state.set({mode: 'change_type', section: 'change_type'});



    new HeaderView({
      model: Core.g.layout
    }).render_to('.app-center');


    new LayoutZoneChooserView({
      collection: zones
    }).render_to('.right-sidebar');




    return this;
  },


  setup_zone_wrappers: function(){

    var current_layout_zones = this.zones;
    var new_layout_type = this.new_layout_type;


    var $el = $('.zones');
    $el.html(new_layout_type.get('html'));


    $el.find('[data-zone]').each(function(){
      var zone_id = $(this).data('zone');
      var zone_wrapper = new_layout_type.zones.get(zone_id);

      zone_wrapper.children = [];

      var zone = current_layout_zones.get(zone_id);
      if(zone){
        zone_wrapper.children.push(zone);
      }

      new ZoneWrapperView({
        el: '[data-zone="'+zone_id+'"]',
        model: zone_wrapper
      }).render();

    });


    return this;
  }




});

'use strict';

var Core = require('../core');
var $ = Core.$;
var Page = require('../page');
var Layout = require('../models/layout');

module.exports =  Page.extend({

  deps: function(done){

    if(!Core.g.layout || Core.g.layout.id != Core.router.params.id){
      Core.g.layout = new Layout({id: Core.router.params.id});
    }

    var draft_layout_id = Core.router.params.draft_layout_id;
    var base_layout = this.base_layout = new Layout({id: draft_layout_id});

    var should_load_published = Core.router.route_name === 'layout_preview';

    Core.g.layout.set('view_locale', Core.router.params.locale);

    return  $.when(Core.g.config.fetch_once())
             .then(function(){
                return Core.g.shared_layouts.fetch_once({via: 'shared'});
             })
             .then(function() {
                return $.when(
                  // Core.g.layout.request && Core.g.layout.request.read ? true : Core.g.layout.fetch({data: {published: should_load_published }}),
                  Core.g.layout.fetch({data: {published: should_load_published }}),
                  Core.g.layout_types.fetch_once(),
                  draft_layout_id ? base_layout.fetch_once() : true
                );
             })
             .then(function() {
               return Core.g.block_types.fetch_once();
             })
             .then(done, function(xhr) {
               done(xhr);
             });
  }

});

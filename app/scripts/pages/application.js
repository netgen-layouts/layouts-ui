'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var Page = require('../page');
var Layout = require('../models/layout');

module.exports =  Page.extend({

  deps: function(done){

    if(!Core.g.layout || Core.g.layout.id != Core.router.params.id){
      Core.g.layout = new Layout({id: parseInt(Core.router.params.id, 10)});
    }

    var draft_layout_id = Core.router.params.draft_layout_id;
    var base_layout = this.base_layout = new Layout({id: parseInt(draft_layout_id, 10)});

    var should_load_published = Core.router.route_name === 'layout_preview';

    return  $.when(Core.g.config.fetch_once())
             .then(function(){
                return Core.g.shared_layouts.fetch_once({via: 'shared'});
             })
             .then(function() {
                return $.when(
                  Core.g.layout.fetch({data: {published: should_load_published, locale: Core.router.params.locale }}),
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


'use strict';

var Core = require('core_boot');
var Page = require('../page');
var Layout = require('../models/layout');

module.exports =  Page.extend({

  deps: function(done){

    Core.g.layout = new Layout({id: parseInt(Core.router.params.id, 10)});

    return  $.when(Core.g.config.fetch())
             .then(function() {
               return Core.g.layout.fetch();
             })
             .then(function() {
               return $.when(Core.g.block_types.fetch_once())
             })
             .then(done, function(xhr) {
               done(xhr);
             })


  }

});


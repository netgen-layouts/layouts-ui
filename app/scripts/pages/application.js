'use strict';

var Core = require('core_boot');
var Page = require('../page');
var Layout = require('../models/layout');

module.exports =  Page.extend({

  deps: function(done){

    Core.g.layout = new Layout({id: parseInt(Core.router.params.id, 10)});

    var resources = [
      Core.g.config.fetch(),
      Core.g.block_types.fetch_once(),
      Core.g.layout.blocks.fetch(),
      Core.g.layout.fetch()
    ];

    return $.when.apply(null, resources).then(done);

  }

});


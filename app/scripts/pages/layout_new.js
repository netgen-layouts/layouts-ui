'use strict';
var Page = require('../page');
var Layout = require('../models/layout');
var NewLayoutView = require('../views/new_layout');


module.exports = Page.extend({
  master: 'application',
  layout: 'layout',

  deps: function(done){
    return  $.when(
              Core.g.layout_types.fetch()
            )
            .then(done);
  },

  main: function() {

    var layout = new Layout();

    var layout_view = new NewLayoutView({
      url: '/bm/app/layouts/form/create',
      model: layout
    });


    layout_view.render().open();

  }
});

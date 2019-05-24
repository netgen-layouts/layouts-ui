'use strict';
var Core = require('../core');
var Env = require('../environments/default');
var $ = Core.$;
var Page = require('../page');
var Layout = require('../models/layout');
var NewLayoutView = require('../views/new_layout');


module.exports = Page.extend({
  master: 'layout_new',
  layout: 'layout_new',

  deps: function(done){
    return  $.when(
              Core.g.layout_types.fetch_once()
            )
            .then(done);
  },

  main: function() {

    $(document.body).addClass('new_layout');

    var layout = new Layout();

    var layout_view = new NewLayoutView({
      url: Env.bm_app_url('layouts/form/create'),
      model: layout,
      modal_options: {
        keyboard: false
      }
    });

    this.child_view.$el.addClass("new_layout_page");


    layout_view.render().open();

  }
});

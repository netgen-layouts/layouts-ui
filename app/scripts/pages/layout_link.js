'use strict';
var LayoutPage = require('./layout');
var LayoutLinkChooserView = require('../views/layout_link_chooser');


module.exports = LayoutPage.extend({
  main: function(){
    LayoutPage.prototype.main.apply(this, arguments);
    $('#app').addClass('preview');


    var view = new LayoutLinkChooserView();
    $('.app-header').append(view.render().$el);

    return this;
  },
});

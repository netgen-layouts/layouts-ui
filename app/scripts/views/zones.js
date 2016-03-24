'use strict';

var Core = require('core_boot');
var ZoneView = require('./zone');

module.exports = Core.View.extend({
  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.collection, 'reset', this.parse_dom);
    return this;
  },

  parse_dom: function(){
    var id, self = this;
    this.$('[data-zone]').each(function(){
      id = $(this).data('zone');
      new ZoneView({
        model: self.collection.get(id),
        el: this
      });
    });
    return this;
  },
});

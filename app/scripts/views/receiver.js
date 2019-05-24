'use strict';

var Core = require('../core');
var $ = Core.$;

function Receiver(el) {
  this.$el = $(el);
  this.view = this.$el.data('_view');
  this.model = this.view.model;
}

Receiver.prototype.is_zone = function() {
  return this.model.class_name === 'zone';
};

Receiver.prototype.zone_id = function() {
  return this.$el.data('zone');
};


module.exports = Receiver;

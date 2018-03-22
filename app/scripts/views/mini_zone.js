'use strict';

var Core = require('netgen-core');
var Layout = require('../models/layout');
var Zone = require('../models/zone');
var DndView = require('./dnd');
var _ = require('underscore');


  module.exports = Core.View.extend(DndView).extend({

    template: 'mini_zone',

    initialize: function(){
      Core.View.prototype.initialize.apply(this, arguments);
      // this.listenTo(Core.state, 'change', this.render);
      // this.listenTo(this.model, 'unlink:success', this.on_unlink);

      // this.is_zone = true;
      this.model.is_linked() && this.$el.addClass('shared-zone')
      return this;
    }

  });

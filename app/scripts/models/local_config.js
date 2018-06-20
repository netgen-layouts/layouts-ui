'use strict';

var Core = require('@netgen/layouts-core-ui');

module.exports = Core.Backbone.Model.extend({

  localStorage: function(){
    return new Core.Backbone.LocalStorage('local_config');
  }

});

'use strict';

var Core = require('@netgen/layouts-core-ui');
var _ = require('underscore');

module.exports = Core.Modal.extend({
  template: 'layout_type_chooser',

  initialize: function(){
    Core.Modal.prototype.initialize.apply(this, arguments);
    this.context.current_type_id = Core.g.layout.get('type');
    this.context.current_selected_type_id = Core.router.params.layout_type_id || Core.g.layout.get('type');

    this
      .on('apply', function(){
        this.load_layout();
      })
      .on('cancel', function() {
        !Core.router.params.layout_type_id && Core.router.navigate_to('layout', {id: Core.router.params.id, type: 'edit'} );
      })
    return this;
  },

  load_layout: function() {
    var id = this.serialize().params.layout_type.id;
    Core.router.navigate_to_params({layout_type_id: id});
  },

});

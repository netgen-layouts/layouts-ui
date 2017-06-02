'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var _ = require('underscore');

module.exports = Core.ModalForm.extend({

  render: function(){
    Core.Modal.prototype.render.apply(this, arguments);
    var $shared_checkbox = this.$('#create_shared');
    Core.router.params.shared && $shared_checkbox.prop('checked', true);
    $shared_checkbox.parent().hide();
    return this;
  },

  on_success: function(resp){
    this.close();
    Core.router.navigate_to('layout', {id: resp.id, type: 'edit'});
  },

});

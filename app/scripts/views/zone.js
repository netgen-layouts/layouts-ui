  'use strict';

  var Core = require('core_boot');

  module.exports = Core.View.extend({

    events: {
      'click': '$goto_parent'
    },
    // template: 'blocks/item',
    initialize: function(){
      Core.View.prototype.initialize.apply(this, arguments);
      this.mark_zone_type();

      return this;
    },

    mark_zone_type: function(){
      this.$el.addClass('zone_type_'+ this.model.get('type_name'));
    },

    $goto_parent: function(e){
      e.preventDefault();
      if(this.model.is_inherited()){
        Core.router.navigate_to('layout', {id: Core.g.layout.get('parent_id')});
      }
    },

    is_container: function(){
      return false;
    }

  });

  'use strict';

  var Core = require('core_boot');
  var Layout = require('../models/layout');

  module.exports = Core.View.extend({

    events: {
      //'click': '$goto_parent'
      'click .js-choose': '$choose',
      'click .js-link': '$link'
    },

    initialize: function(){
      Core.View.prototype.initialize.apply(this, arguments);
      this.listenTo(Core, 'zone_chooser:on', this.zone_chooser_on);
      this.listenTo(Core, 'zone_chooser:off', this.zone_chooser_off);
      this.mark_zone_type();
      return this;
    },

    $choose: function(e) {
      e.preventDefault();
      Core.router.navigate_to('layout_preview', {id: 1, zone_id: this.model.id, draft_layout_id: Core.g.layout.id });
    },

    $link: function(e){
      e.preventDefault();
      var layout = new Layout({id: 1});
      layout
        .fetch()
        .done(function() {
          Core.router.navigate_to('layout', {id: Core.router.params.draft_layout_id });
        }.bind(this))
      return this;
    },

    // $goto_parent: function(e){
    //   e.preventDefault();
    //   if(this.model.is_inherited()){
    //     Core.router.navigate_to('layout', {id: Core.g.layout.get('parent_id')});
    //   }
    // },



    mark_zone_type: function(){
      this.$el.addClass('zone_type_'+ this.model.get('type_name'));
    },

    is_container: function(){
      return false;
    },


    is_in_link_mode: function() {
      return "zone_id" in Core.router.params;
    },

    has_blocks: function() {
      return this.$('[data-block]').length;
    },


    empty: function () {
      return !this.has_blocks();
    },

    render: function(){
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> is_in_link_mode', this.is_in_link_mode())
      if(this.is_in_link_mode()){
        this.render_linker()
      }
    },


    zone_chooser_on: function() {
      if(this.has_blocks()){
        this.render_disabler();
      }else{
        this.render_chooser();
      }
      this.$el.addClass('chooser_on');

    },


    zone_chooser_off: function() {
      this.disabler && this.disabler.remove();
      this.chooser && this.chooser.remove();
      this.$el.removeClass('chooser_on');

    },

    render_chooser: function() {
      this.chooser = $(JST.zone_chooser());
      this.$el.append(this.chooser);
    },

    render_disabler: function() {
      this.disabler = $('<div class="disabler" />')
      this.$el.append(this.disabler);
    },


    render_linker: function() {
      this.linker = $(JST.zone_linker());
      this.$el.append(this.linker);
    }

  });

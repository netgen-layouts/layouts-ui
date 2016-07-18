  'use strict';

  var Core = require('core_boot');
  var Layout = require('../models/layout');
  var Zone = require('../models/zone');


  module.exports = Core.View.extend({

    events: {
      //'click': '$goto_parent'
      'click .js-choose': '$choose',
      'click .js-unlink': '$unlink',
      'click .js-link': '$link'
    },

    initialize: function(){
      Core.View.prototype.initialize.apply(this, arguments);
      this.listenTo(Core, 'zone_chooser:on', this.zone_chooser_on);
      this.listenTo(Core, 'zone_chooser:off', this.zone_chooser_off);
      this.listenTo(this.model, 'unlink:success', this.on_unlink);
      this.mark_zone_type();
      return this;
    },

    $choose: function(e) {
      e.preventDefault();
      Core.router.navigate_to('layout_preview', {id: Core.g.shared_layouts.first().id, zone_id: this.model.id, draft_layout_id: Core.g.layout.id });
    },

    $link: function(e){
      e.preventDefault();

      var draft_layout_zone = new Zone({
        identifier: Core.router.params.zone_id,
        layout_id: Core.router.params.draft_layout_id,
      })

      draft_layout_zone
        .link_with_zone(this.model)
        .done(function() {
          Core.router.navigate_to('layout', {id: Core.router.params.draft_layout_id, type: 'edit' });
        }.bind(this))
      return this;
    },


    $unlink: function(e){
      e.preventDefault();
      this.model.sync_unlink();
    },


    on_unlink: function(){
      this.render_chooser();
      this.$el.removeClass('linked_zone');
      return this;
    },

    // $goto_parent: function(e){
    //   e.preventDefault();
    //   if(this.model.is_inherited()){
    //     Core.router.navigate_to('layout', {id: Core.g.layout.get('parent_id')});
    //   }
    // },


    mark_zone_type: function(){
      this.model.is_linked() && this.$el.addClass('linked_zone');
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
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>> is_in_link_mode', this.is_in_link_mode())
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
      this.chooser && this.chooser.remove();
      this.context.model = this.model;
      this.context.view = this;

      this.chooser = $(JST.zone_chooser(this.context));
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

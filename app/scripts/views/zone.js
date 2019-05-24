'use strict';

var Core = require('../core');
var Layout = require('../models/layout');
var Zone = require('../models/zone');
var DndView = require('./dnd');
var _ = require('underscore');


  module.exports = Core.View.extend(DndView).extend({

    template: 'zone',
    className: 'zone-view',

    events: {
      //'click': '$goto_parent'
      'click .js-choose': '$choose',
      'click .js-unlink': '$unlink',
      'click .js-link': '$link',
      'click .js-unmap': '$unmap'
    },

    initialize: function(){
      Core.View.prototype.initialize.apply(this, arguments);
      this.listenTo(Core.state, 'change', this.render);
      this.listenTo(this.model, 'unlink:success', this.on_unlink);
      this.mark_zone_type();
      this.is_zone = true;
      return this;
    },


    render_blocks: function(){
      var view_block, views = [];
      var views = _.map(this.model.blocks(), function(block){
        return Core.blocks.create_view(block.get('definition_identifier'), block).$el;
      });

      this.$('.zone-body').append(views);

      this.disableContenteditable();
      return this;
    },

    $unmap: function(e){
      e.preventDefault();
      this.model.set({mapped: false});
      this.remove();
      Core.trigger('sortable:end');
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
          Core.state.set({mode: 'edit', section: 'normal'});
        }.bind(this))
      return this;
    },

    $unlink: function(e){
      e.preventDefault();

      var self = this;
      return new Core.Modal({
        title: 'Unlink zone',
        body: 'Are you sure you want to unlink this zone?',
        apply_text: 'Unlink'
      }).on('apply', function(){
        self.model.sync_unlink();
      }).open();

    },


    on_unlink: function(){
      this.model.set_zone_attributes_on_blocks();
      this.render();
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

    disableContenteditable: function(){
      this.model.is_linked() && this.$('span[contenteditable]').prop('contenteditable', false);
    },

    is_container: function(){
      return false;
    },


    is_in_link_mode: function() {
      return 'zone_id' in Core.router.params;
    },

    show_header: function(){
      return Core.state.in_mode('linking', 'choosing');
    },

    detect_mode: function() {

      if(this.is_in_link_mode()){
        return 'linker';
      }

      if(Core.state.get('mode') === 'linking'){
        // return this.model.has_blocks() ? 'disabler' : 'chooser';
        return 'chooser'
      }

      if(this.model.is_linked()){
        return 'linked';
      }

      return 'normal';

    },

    set_class: function(){
      (this.detect_mode() === 'chooser') ? this.$el.addClass('zone-disabled') : this.$el.removeClass('zone-disabled');
      (this.detect_mode() === 'linker') ? this.$el.addClass('shared-zone') : this.$el.removeClass('shared-zone');
    },


    render: function(){
      this.context.mode = this.detect_mode();
      this.context.show_header = this.show_header();
      Core.View.prototype.render.apply(this, arguments);
      this.set_class();
      this.render_blocks();
      this.setup_dnd_for_containers_and_zones();
      this.setup_trash();
      return this;
    },


    render_basics: function(){
      this.context.mode = 'chooser';
      this.context.show_zone_map_overlay = true;
      Core.View.prototype.render.apply(this, arguments);
      this.set_class();
      this.render_blocks();
      return this;
    },

  });

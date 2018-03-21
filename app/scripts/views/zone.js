'use strict';

var Core = require('netgen-core');
var Layout = require('../models/layout');
var Zone = require('../models/zone');
var DndView = require('./dnd');
var _ = require('underscore');


  module.exports = Core.View.extend(DndView).extend({

    template: 'zone',

    events: {
      //'click': '$goto_parent'
      'click .js-choose': '$choose',
      'click .js-unlink': '$unlink',
      'click .js-link': '$link'
    },

    initialize: function(){
      Core.View.prototype.initialize.apply(this, arguments);
      this.listenTo(Core.state, 'change', this.render);
      this.listenTo(this.model, 'unlink:success', this.on_unlink);
      this.mark_zone_type();
      this.is_zone = true;
      return this;
    },


    load_blocks: function(){
      var view_block, views = [];
      console.log('load blocks');
      var views = _.map(this.model.blocks(), function(block){
        block.set({
          zone_identifier: this.model.id,
          layout_id: this.model.get('layout_id')
        });
        return Core.blocks.create_view(block.get('definition_identifier'), block).$el;
      }, this);

      this.$('.zone-body').append(views);

      this.disableContenteditable();
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
      this.load_blocks();
      this.setup_dnd_for_containers_and_zones();
      this.setup_trash();
      return this;
    },


    render_basics: function(){
      this.context.mode = 'chooser';
      this.context.show_zone_map_overlay = true;
      Core.View.prototype.render.apply(this, arguments);
      this.set_class();
      this.load_blocks();
      return this;
    },

  });

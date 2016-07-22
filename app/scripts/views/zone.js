  'use strict';

  var Core = require('core_boot');
  var Layout = require('../models/layout');
  var Zone = require('../models/zone');
  var _ = require('underscore');


  module.exports = Core.View.extend({

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
      return this;
    },


    load_blocks: function(){
      var view_block, views = [];

      var views = _.map(this.model.blocks(), function(block){
        return Core.blocks.create_view(block.get('definition_identifier'), block).$el;
      });

      this.$el.append(views)


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
          Core.state.set({mode: 'normal'});
        }.bind(this))
      return this;
    },


    $unlink: function(e){
      e.preventDefault();

      var self = this;
      return new Core.Modal({
        title: 'Confirm',
        body: 'Are you sure you want to unlink this zone?'
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

    is_container: function(){
      return false;
    },


    is_in_link_mode: function() {
      return "zone_id" in Core.router.params;
    },



    detect_mode: function() {

      if(this.is_in_link_mode()){
        return 'linker'
      }

      if(Core.state.get('mode') === 'linking'){
        return this.model.has_blocks() ? 'disabler' : 'chooser';
      }


      return 'normal';

    },



    render: function(){
      this.context.mode = this.detect_mode();
      Core.View.prototype.render.apply(this, arguments);
      this.load_blocks();
    }

  });

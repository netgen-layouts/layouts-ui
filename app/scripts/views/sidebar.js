'use strict';

var Core = require('core');

var FormView = require('./form');
var BmCollectionView = require('./bm_collection');
var $ = Core.$;

module.exports = Core.View.extend({

  template: 'sidebar',
  className: 'sidebar',

  prevent_auto_render: true,

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'destroy', this.destroy);
    this.listenTo(this.model, 'restore:success', this.show_loader);
    this.listenTo(Core, 'editing:unmark', this.destroy);
    this.on('xeditable:apply:collection_type', this.$change_collection_type);
    this.on('xeditable:apply:collection_type', this.show_loader);
    this.on('loaded', this.on_loaded);
    this.show_loader();
    this.xhrs = [];
    return this;
  },

  events: {
    // 'change #collection-type': '$change_collection_type',
    'click .js-apply': '$apply',
    'click .toggle-link': '$panel_toggle',
    'click .aside-tab-control a': '$tab_toggle'
  },

  on_loaded: function(){
    this.$toggle_panels_on_render();
    this.$multiple_select_height();
    this.remove_loader();
  },

  remove_loader: function(){
    $('#sidebar .loader').fadeOut();
    return this;
  },

  show_loader: function(){
    $('#sidebar .loader').css({display: 'flex'}).fadeIn(1);
    return this;
  },

  destroy: function(){
    this.remove();
    $('.right-sidebar').html(JST.sidebar());
  },

  //TODO: Call some ajax to change collection type and bind to that event in sidebar
  $change_collection_type: function(){
    var data = this.serialize().params.block_collection;
    this.model.default_bm_collection().sync_change_type(data);
  },

  $panel_toggle: function(e){
    var panel = $(e.currentTarget).attr('aria-controls');
    if ($(e.currentTarget).attr('aria-expanded') === 'false'){
      Core.g.local_config.save(panel, false);
    } else {
      Core.g.local_config.save(panel, true);
    }
  },

  $toggle_panels_on_render: function(){
    for(var key in Core.g.local_config.attributes){
      if(key.indexOf('collapse') === 0 && Core.g.local_config.attributes[key]){
        this.$('.toggle-link[aria-controls=' + key + ']').attr('aria-expanded', 'false');
        this.$('#' + key).removeClass('in');
      }
    }
  },

  $multiple_select_height: function(){
    this.$('select[multiple]').each(function(){
      var l = $(this).find('option').length;
      (l > 10) && (l = 10);
      $(this).attr('size', l);
    });
  },

  $tab_toggle: function(e){
    Core.g.local_config.save('active_tab', $(e.currentTarget).attr('id'));
  },

  load: function(){
    $.get(this.model.edit_url()).done(function(response){
      this.$el.html(response);
      this.render();
    }.bind(this));
    return this;
  },


  render: function(){
    Core.View.remove_views_in_element('.sidebar');
    var self = this;

    this.$('[data-form]').each(function(){
      var $this = $(this);
      var view = new FormView({
        el: $this,
        model: self.model,
        url: $this.data('form')
      });
      var xhr = view.load();

      self.xhrs.push(xhr);
    });

    var bm_collection_xhr = $.Deferred();
    var bm_collections_xhr = this.model
      .load_bm_collections()
      .done(function(){
        var bm_collection = this.model.default_bm_collection();
        if(!bm_collection){
          bm_collection_xhr.resolve();
          return;
        }

        new BmCollectionView({
          model: bm_collection,
          el: this.$('.collection-items')
        });

        bm_collection.fetch_results().done(function(){
          bm_collection_xhr.resolve();
        });

      }.bind(this));

    this.$('#aside-tabs').browser_tabs({active_tab: Core.g.local_config.get('active_tab')});

    this.xhrs.push(bm_collections_xhr, bm_collection_xhr);

    $.when.apply($, this.xhrs).then(function(){
      this.trigger('loaded');
    }.bind(this));

    this.trigger_render();

    return this;
  }

});

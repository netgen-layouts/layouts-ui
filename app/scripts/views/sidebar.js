'use strict';

var Core = require('netgen-core');

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
    this.listenTo(this.model, 'change:is_translatable', this.load);
    this.listenTo(Core, 'editing:unmark', this.destroy);
    this.on('xeditable:apply:collection_type', this.$change_collection_type);
    this.on('xeditable:apply:collection_type', this.show_loader);
    this.on('loaded', this.on_loaded);

    this.xhrs = [];
    return this;
  },

  events: {
    // 'change #collection-type': '$change_collection_type',
    'click .js-apply': '$apply',
    'click .toggle-link': '$panel_toggle',
    'click .aside-tab-control a': '$tab_toggle',
    'input input[type="range"]': '$range_value'
  },

  on_loaded: function(){
    this.$toggle_panels_on_render();
    this.$add_range_values();
    this.remove_loader();
    this.is_disabled();
  },


  is_disabled: function(){
    var disabled = Core.state.in_mode('translate') ? !this.model.get('is_translatable') : false;
    this.$el.attr('data-disabled', disabled);
    this.$el.find(':input:not(:disabled)').attr('disabled', disabled);


    var $focusableElements = this.$el.find('[data-input]:not([data-disabled="true"])').attr('data-disabled', disabled).find('a');
    $focusableElements.each(function(){
      if(disabled){
        $(this).data('_tabindex', $(this).attr('tabindex'));
        $focusableElements.attr('tabindex', '-1');
      }else{
        $focusableElements.attr('tabindex', $(this).data('_tabindex'));
        $(this).data('_tabindex', null);
      }
    });


    return this;
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

  $add_range_values: function(){
    this.$('input[type="range"]').each(function(){
      $(this).siblings('label').append('<span class="range-value">' + $(this).val() + '</span>');
    });
  },

  $range_value: function(e){
    $(e.currentTarget).siblings('label').find('.range-value').html(e.currentTarget.value);
  },

  $tab_toggle: function(e){
    Core.g.local_config.save('active_tab', $(e.currentTarget).attr('id'));
  },

  load: function(){
    this.show_loader();
    $.get(this.model.edit_url()).done(function(response){
      this.$el.html(response);
      this.render();
    }.bind(this));
    return this;
  },


  render: function(){
    Core.View.remove_views_in_element('.sidebar');
    var self = this;
    var bm_collection = this.model.default_bm_collection();

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

    this.$('#aside-tabs').browser_tabs({active_tab: Core.g.local_config.get('active_tab')});

    if(bm_collection){
      new BmCollectionView({
        model: bm_collection,
        el: this.$('.collection-items .body')
      });

      this.xhrs.push(bm_collection.fetch_results());
    }


    $.when.apply($, this.xhrs).then(function(){
      this.trigger('loaded');
      this.trigger_render();
    }.bind(this));


    return this;
  }

});

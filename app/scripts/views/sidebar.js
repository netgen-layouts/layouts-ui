'use strict';

var Core = require('core');
var _ = require('underscore');
var FormView = require('./form');
var BmCollectionView = require('./bm_collection');
var $ = require('jquery');

module.exports = Core.View.extend({

  template: 'sidebar',
  className: 'sidebar',

  prevent_auto_render: true,

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'destroy', this.destroy);
    this.listenTo(Core, 'editing:unmark', this.destroy);
    this.on('xeditable:apply:collection_type', this.$change_collection_type);
    this.on('loaded', this.remove_loader);
    this.show_loader();
    this.xhrs = [];
    return this;
  },

  events: {
    // 'change #collection-type': '$change_collection_type',
    'click .js-apply': '$apply'
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
    // this.model.trigger('refresh:sidebar');
    //
    var data = this.serialize().params.block_collection;
    console.log(this.model);
    this.model.default_bm_collection().sync_change_type(data);
    // return this;
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

    this.$('#aside-tabs').browser_tabs();


    this.xhrs.push(bm_collections_xhr, bm_collection_xhr);

    $.when.apply($, this.xhrs).then(function(){
      this.trigger('loaded');
    }.bind(this));

    this.trigger_render();

    return this;
  }

});

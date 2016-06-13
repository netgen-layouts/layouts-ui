'use strict';

var Core = require('core');
var _ = require('underscore');
var FormView = require('./form');
var BmCollectionView = require('./bm_collection');

module.exports = Core.View.extend({

  template: 'sidebar',
  className: 'sidebar',

  prevent_auto_render: true,

  initialize: function(){
    Core.View.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'destroy', this.destroy);
    return this;
  },

  events: {
    'change #collection-type': '$change_collection_type'
  },


  destroy: function(){
    this.remove();
    $('.right-sidebar').html(JST.sidebar());
  },

  //TODO: Call some ajax to change collection type and bind to that event in sidebar
  $change_collection_type: function(){
    this.model.trigger('refresh:sidebar');
    return this;
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
      new FormView({
        el: $this,
        model: self.model,
        url: $this.data('form')
      }).load();
    });



    this.model
      .load_bm_collections()
      .done(function(){
        var bm_collection = this.model.bm_collections.where({identifier: 'default'})[0];
        new BmCollectionView({
          model: bm_collection,
          el: this.$('.collection-items')
        });

        bm_collection.fetch({via: 'result', data: {offset: bm_collection.get('offset'), limit: bm_collection.get('limit')} });

      }.bind(this));

    this.$('#aside-tabs').browser_tabs();

    this.trigger_render();

    return this;
  }

});

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


  destroy: function(){
    $('.right-sidebar').html(JST.sidebar());
    this.remove();
  },


  render: function(){

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
          // el: this.$('[data-render="bm_collection"]')
          el: this.$('.collection-items')
        }).render();
        console.log('bm_collection', bm_collection);

        bm_collection.fetch();

      }.bind(this));



    this.trigger_render();

    return this;
  }

});

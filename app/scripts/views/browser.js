define(['underscore', 'view', './modal', './browser/tree'], function(_, View, Modal, TreeView){
  'use strict';

  return Modal.extend({

    template: 'browser',

    className: 'browser modal fade',

    prevent_auto_render: true,

    initialize: function(){
      Modal.prototype.initialize.apply(this, arguments);
      this.on('open', this.render_subtree);
      return this;
    },

    render_subtree: function(el, items){
      var collection = this.collection.new_from(items || this.collection.roots());
      console.log(el, items, collection);

      new TreeView({
        collection: collection,
        browser: this,
        el: el || '.tree'
      }).render();

      return this;
    }

  });

});

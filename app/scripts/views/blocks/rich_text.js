'use strict';

var Block = require('./block');
var Inline = require('./inline');

module.exports = Block.extend(Inline).extend({
  render: function() {
    Block.prototype.render.apply(this,arguments);
    this.setup_editor();
  },

/*
  initialize: function() {
    Block.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, '')
  },
  */

  get_sidebar_element: function() {
    var name = this.$editor_el.data('attr');
    return $('.sidebar [name*="['+name+']"]');
  },

  setup_editor: function() {
    var self = this;

    this.$editor_el = this.$('.alloy-editor');
    this.alloy = AlloyEditor.editable(this.$editor_el.get(0));
    this.editor = this.alloy._editor;


    this.editor.on('change', function(){
      var $textarea = self.get_sidebar_element();
      var data = this.getData();
      $textarea.html(data);
      self.debounced_save($textarea);
    })
  },

});

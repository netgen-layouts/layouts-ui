'use strict';

var Block = require('./block');
var Inline = require('./inline');
var _ = require('underscore');

module.exports = Block.extend({

  prevent_auto_render: true,

  render: function() {
    Block.prototype.render.apply(this,arguments);
    this.setup_editor();
  },

  get_sidebar_element: function() {
    var name = this.$editor_el.data('attr');
    return $('.sidebar [name*="['+name+']"]');
  },

  setup_editor: function() {
    var self = this;

    this.$editor_el = this.$('.alloy-editor');
    this.alloy = AlloyEditor.editable(this.$editor_el.get(0));
    //this.editor = CKEDITOR.inline( this.$editor_el.get(0));
    this.editor = this.alloy._editor;


    this.editor.on('change', function(){
      var $textarea = self.get_sidebar_element();
      var data = this.getData();
      $textarea.html(data);
      self.debounced_save($textarea);
    })
  },


  debounced_save: _.debounce(function($input){
    this.$save($input);
  }, 500),


  $save: function($input){
    this.model.save_via_form($input.closest('form'))
      .done(this.model.trigger.bind(this.model, 'save_inline:done'))
      .fail(this.model.trigger.bind(this.model, 'save_inline:error'));

  }

});

/*global CKEDITOR */
'use strict';

var Core = require('@netgen/layouts-core-ui');
var $ = Core.$;
var Block = require('./block');
var _ = require('underscore');


CKEDITOR.on( 'instanceCreated', function ( event ) {
  var editor = event.editor;

  editor.on( 'configLoaded', function () {

    editor.config.extraPlugins = 'justify';

    editor.config.removePlugins =
        'colorbutton,find,flash,font,' +
        'forms,iframe,image,newpage,removeformat,' +
        'smiley,specialchar,stylescombo,templates';

    // Rearrange the toolbar layout.
    editor.config.toolbarGroups = [
      { name: 'undo' },
      { name: 'styles' },
      { name: 'insert' },
      { name: 'editing', groups: [ 'basicstyles', 'links' ] },
      { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    ];
  } );

});


module.exports = Block.extend({

  supports_modal_mode: false,

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

    this.$editor_el = this.$('.rich-text-editor');
    this.editor = CKEDITOR.inline( this.$editor_el.get(0));


    this.editor.on('change', function(){
      var $textarea = self.get_sidebar_element();
      var data = this.getData();
      $textarea.html(data);
      self.debounced_save($textarea);
    });
  },


  debounced_save: _.debounce(function($input){
    this.$save($input);
  }, 500),


  remove: function(){
    this.editor.destroy();
    $('.ae-ui').remove();
    Block.prototype.remove.apply(this, arguments);
    return this;
  },

  $save: function($input){
    this.model.save_via_form($input.closest('form'), 'save_inline', {silent: true});
  },

  enter_modal_mode: function(){
    this.reinitialize();
  },

  exit_modal_mode: function(){
    this.reinitialize();
  },


  reinitialize: function(){
    this.editor.destroy();
    $('.ae-ui').remove();
    this.setup_editor();
    return this;
  },

});

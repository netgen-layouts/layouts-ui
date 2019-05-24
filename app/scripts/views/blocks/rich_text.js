/*global CKEDITOR */
'use strict';

var Core = require('../../core');
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

CKEDITOR.on( 'dialogDefinition', function ( event ) {
  var dialogName = event.data.name;

  if (dialogName == 'link') {
    var dialogDefinition = event.data.definition;
    var informationTab = dialogDefinition.getContents('target');
    var targetField = informationTab.get('linkTargetType');

    // Keep only "<not set>" and "New Window (_blank)" options
    targetField.items = targetField.items.filter(function ( x ) { return x[1] == '_blank' || x[1] == 'notSet'; });
  }
});

module.exports = Block.extend({

  supports_modal_mode: false,

  initialize: function(){
    this._super('initialize', arguments);
    this.listenTo(this.model, 'sidebar:loaded', this.enable_editor);
    this.listenTo(this.model, 'sidebar:destroyed', this.disable_editor);
    return this;
  },

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
    if (this.$editor_el.length > 0) {
      this.editor = CKEDITOR.inline(this.$editor_el.get(0));
      this.editor.config.readOnly = true;

      this.editor.on('change', function(){
        var $textarea = self.get_sidebar_element();
        var data = this.getData();
        $textarea.html(data);
        self.debounced_save($textarea);
      });
    }
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

  enable_editor: function(){
    this.editor.setReadOnly(false);
    this.editor.focus();
  },

  disable_editor: function(){
    this.editor.setReadOnly();
    //this.editor.blur();
  },

});

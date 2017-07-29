'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var Block = require('./block');
var _ = require('underscore');

module.exports = Block.extend({
  supports_modal_mode: true,

  render: function() {
    Block.prototype.render.apply(this,arguments);
    this.setup_editor();
  },

  get_sidebar_element: function() {
    var name = this.$editor_el.data('attr');
    return $('.sidebar [name*="['+name+']"]');
  },

  setup_editor: function() {
    var self = this, editor, session;

    this.$editor_el = this.$('.ace-editor');
    this.editor = editor = ace.edit(this.$editor_el.get(0));
    session = editor.getSession();

    editor.setTheme("ace/theme/monokai");
    editor.setHighlightActiveLine(true);
    //editor.setOptions({fontSize: "12pt"});

    session.setMode("ace/mode/html");
    session.setTabSize(4);
    session.setUseSoftTabs(true);


    editor.commands.addCommand({
      name: 'saveFile',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Command-S',
        sender: 'editor|cli'
      },
      exec: function(env, args, request) {
        var $textarea = self.get_sidebar_element();
        self.debounced_save($textarea);
      }
    });

    editor.on('change', function(){
      var $textarea = self.get_sidebar_element();
      var data = editor.getValue();
      $textarea.text(data);
      self.debounced_save($textarea);
    })

    this.remove_doctype_validation(editor);
  },

  remove_doctype_validation: function(editor){
    var session = editor.getSession();
    session.on("changeAnnotation", function() {
      var annotations = session.getAnnotations() || [],
          len,
          i = len = annotations.length;
      while (i--) {
        if(/DOCTYPE/.test(annotations[i].text)) {
          annotations.splice(i, 1);
        }
      }
      if(len>annotations.length) {
        session.setAnnotations(annotations);
      }
    });
    return this;
  },


  debounced_save: _.debounce(function($input){
    this.$save($input);
  }, 500),


  $save: function($input){
    this.model.save_via_form($input.closest('form'), 'save_inline', {silent: true});
  },


  enter_modal_mode: function(){
    this.editor && this.editor.resize();
  },

  exit_modal_mode: function(){
    this.editor && this.editor.resize();
  },

});

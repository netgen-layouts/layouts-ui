'use strict';

var Block = require('./block');
var AceEditor = require('./ace_editor');

AceEditor.mode = "ace/mode/markdown";

module.exports = Block.extend(AceEditor);

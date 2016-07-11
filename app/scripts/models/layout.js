'use strict';

var Core = require('core_boot');
var Blocks = require('../collections/blocks');

module.exports = Core.Model.extend({

  path: 'layouts',

  initialize: function(){
    Core.Model.prototype.initialize.apply(this, arguments);
    this.blocks = new Blocks();
    this.on('change:id', this.reset_blocks_loaded);
    this.on('discard:success', this.reset_loaded)
    this.blocks.url = this.url('blocks');
    return this;
  },

  reset_loaded: function(){
    this.loaded = null;
  },

  reset_blocks_loaded: function(){
    this.blocks.reset(null);
    this.blocks.loaded = false;
    return this;
  },

  toJSON: function(options){
    options || (options = {});
    var json = Core.Model.prototype.toJSON.apply(this, arguments);
    if(!options.parse){return json;}
    json.positions = JSON.stringify(json.positions);
    return json;
  },

  inherited_zones: function(){
    return Core._.where(Core.g.layout.get('zones'), {kind: 2});
  },

  get_block_by_id: function(id){
    return Core.g.layout.get('blocks').get(id);
  },

  publish: function(){
    return this.save(null, {
      via: 'publish',
      method: 'POST',
      patch: true
    });
  },

  discard: function(){
    return this.save(null, {
      via: 'discard',
      method: 'DELETE',
      url:this.url('draft'),
      patch: true
    });
  },


  create_new_draft: function(){
    return this.save(null, {
      via: 'draft',
      method: 'POST',
      patch: true
    });
  }

});

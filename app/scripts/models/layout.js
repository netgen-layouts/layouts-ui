'use strict';

var Core = require('netgen-core');
var $ = Core.$;
var Blocks = require('../collections/blocks');
var Zones = require('../collections/zones');
var _ = require('underscore');

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

  parse: function(resp){
    if(resp){
      _.each(resp.zones, function(zone) {
        zone.layout_id = resp.id
      })
      this.zones = new Zones(resp.zones);
      this.zones.layout = this;
    }

    return Core.Model.prototype.parse.apply(this, arguments);
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
  },


  load_all_blocks: function(opts){
    opts || (opts = {});


    // For linked blocks
    var zone_blocks_loaded = _.map(this.zones.linked(), function(zone){
      return zone.load_blocks({data: {published: true}});
    })

    zone_blocks_loaded.unshift(this.blocks.fetch({
      data: opts.data,
      remove: false
    }));


    $.when.apply($, zone_blocks_loaded).then(function(){
      this.blocks.trigger('blocks_loaded:success');
    }.bind(this));

    return this;
  },

});

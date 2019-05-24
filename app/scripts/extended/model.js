'use strict';

var Core = require('../core_base');
var _ = require('underscore');
var Backbone = require('backbone');
var utils = require('./utils');

module.exports = Core.Model = Backbone.Model.extend({
  // Default implementation, to be overridden by specific models
  api_url: function(path) {
    return path;
  },

  get: function(attr) {
    // Call the getter if available
    if (attr in this) {
      return _.isFunction(this[attr]) ? this[attr].call(this) : this[attr];
    }

    return Backbone.Model.prototype.get.call(this, attr);
  },


  //TODO: maybe add this to collection
  trigger: function(name, model, resp, options){
    if(options && options.silent){return this;}
    Backbone.Model.prototype.trigger.apply(this, arguments);
    return this;
  },


  generate_events: function (event_name, suffix) {
    event_name || (event_name = 'save');
    var events = event_name.split(/\s+/);
    return _.map(events, function (event) {
      return event + ':' + suffix
    })
  },

  trigger_events: function(event_name, suffix, response){
    var events = this.generate_events(event_name, suffix);
    return _.each(events, function(event) {
      this.trigger(event, response);
    }.bind(this))
  },

  save_via_form: function(view_or_form, event_name, set_options){
    event_name || (event_name = 'save');
    var events = event_name.split(/\s+/);

    var $form = view_or_form.jquery ? view_or_form : view_or_form.$('form');
    return $form.ajax_submit({format: this.get('format') })
      .done(function(response){
        this.set(response, set_options).trigger_events(event_name, 'success', response);
      }.bind(this))
      .fail(function(response){
        this.set(response.responseJSON, set_options).trigger_events(event_name, 'error', response);
      }.bind(this));
  },

  set: function(key, value, options) {
    var attrs, attr, setter;

    // Normalize the key-value into an object
    if (_.isObject(key) || key == null) {
      attrs = key;
      options = value;
    } else {
      attrs = {};
      attrs[key] = value;
    }

    // always pass an options hash around. This allows modifying
    // the options inside the setter
    options = options || {};

    // Go over all the set attributes and call the setter if available
    for (attr in attrs) {
      setter = '$'+attr;
      if (_.isFunction(this[setter])) {
        attrs[attr] = this[setter].call(this, attrs[attr], options);
      }
    }

    return Backbone.Model.prototype.set.call(this, attrs, options);
  },


  toggle: function(attr){
    var value = this.get(attr);
    this.set(attr, !value);
    return value;
  },

  // fetch: function(options){
  //   options || (options = {});
  //   options.via && !options.url && (options.url = this.url(options.via));
  //   return  Backbone.Model.prototype.fetch.call(this, options);
  // },

  fetch_once: function(){
    if(this.loaded){return this.loaded;}
    var promise = this.fetch.apply(this, arguments)
    this.loaded = promise;
    return promise;
  },

  urlRoot: function(path, opts){
    opts || (opts = {});
    path || (path = _.result(this, 'path'));
    !opts.custom_path && (path += '(/:id)(/:additional)');
    return this.api_url(path);
  },


  url: function(url_name, params){
    var path = this.paths && this.paths[url_name],
        url;

    if(path){
      url = this.urlRoot(path, {custom_path: true})
      return this.generate_url(url, params);
    }else{
      url = this.urlRoot();
      return this.generate_url(url, _.extend({additional: url_name}, params));
    }
  },

  generate_url: function(url, params){
    var vars = url.match(/(:\w+)/g);
    var attributes = {};
    if(this.attributes){
      _.each(vars, function(name) {
        name = name.slice(1, name.length);
        name && this.get(name) !== undefined && (attributes[name] = this.get(name));
      }.bind(this));
    }
    var all_params = _.extend({}, attributes, params);
    url = utils.interpolate(url, all_params);
    url = utils.clean_route(url);
    return url;
  },


  path_params: function(){
    return {}
  },


  set_if_empty: function(key, value){
    return !this.has(key) && this.set(key, value);
  },


  is_selected: function(){
    return this.get('selected');
  },

  selected_children: function(){
    return _.filter(this.children(), function(item){
      return item.get('selected');
    });
  },

  select: function(){
    this.children && _.invoke(this.children(), 'select');
    this.set({selected: true, indeterminate: false});
    this.children && this.detect_indeterminate();
    this.trigger('select');
    return this;
  },

  unselect: function(){
    this.children && _.invoke(this.children(), 'unselect');
    this.set({selected: false, indeterminate: false});
    this.children && this.detect_indeterminate();
    this.trigger('unselect');
    return this;
  },

  countable: function(){
    if(this.parent && this.parent()){
      return this.parent().get('indeterminate') !== false && this.get('selected') && !this.get('indeterminate');
    }else{
      return this.get('selected') && !this.get('indeterminate');
    }
  },


  detect_indeterminate: function(){
    var parent = this.parent(),
        selected_siblings = _.filter(this.siblings(), function(m){ return m.get('selected'); }),
        _l = selected_siblings.length;
    if(parent){
      if(_l === 0){
        parent.set({selected: false, indeterminate: false});
      }else{
        parent.set({selected: true, indeterminate: parent.children().length !== _l});
      }
    }
    return this;
  },


  add_to_set: function(attr, value){
    this.set(attr, _.union(this.get(attr) || [], [value]));
    return this;
  },

  remove_from_set: function(attr, value){
    this.set(attr, _.without(this.get(attr) || [], value));
    return this;
  },

  snapshot: function(){
    this.state = _.extend({}, this.attributes);
    console.log(this.state);
    return this;
  },

  revert: function(opts){
    opts || (opts = {});
    this.attributes = _.extend({}, this.state);
    !opts.silent && this.trigger('change', this.attributes);
    return this;
  }


});


